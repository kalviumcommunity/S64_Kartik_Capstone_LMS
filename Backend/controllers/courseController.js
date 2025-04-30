import Course from '../models/Course.js';
import asyncHandler from 'express-async-handler';
import Enrollment from '../models/Enrollment.js';


// Create a new course
export const addCourse = asyncHandler(async (req, res) => {
  try {
    console.log('Received course creation request:', req.body);
    console.log('User from request:', req.user);

    const {
      courseTitle,
      courseDescription,
      coursePrice,
      isPublished,
      discount,
      courseContent,
      courseThumbnail
    } = req.body;

    if (!req.user || (!req.user._id && !req.user.id)) {
      console.error('No user found in request');
      res.status(401);
      throw new Error('User not authenticated');
    }

    const educator = req.user._id || req.user.id;

    // Validate required fields
    if (!courseTitle || !courseDescription || !coursePrice || !courseThumbnail) {
      console.error('Missing required fields:', { courseTitle, courseDescription, coursePrice, courseThumbnail });
      res.status(400);
      throw new Error('Missing required fields');
    }

    // Validate course content structure
    if (!Array.isArray(courseContent) || courseContent.length === 0) {
      console.error('Invalid course content structure:', courseContent);
      res.status(400);
      throw new Error('Course content must be a non-empty array');
    }

    const course = await Course.create({
      courseTitle,
      courseDescription,
      coursePrice: Number(coursePrice),
      isPublished: Boolean(isPublished),
      discount: Number(discount) || 0,
      courseContent,
      courseThumbnail,
      educator
    });

    console.log('Course created successfully:', course);
    res.status(201).json(course);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(error.statusCode || 500).json({
      message: error.message || 'Error creating course',
      error: error.stack
    });
  }
});


// Get all courses
export const getCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find()
    .select('courseTitle courseThumbnail coursePrice educator courseRatings isPublished')
    .populate('educator', 'name email')
    .populate('courseRatings.student', 'name');
  res.json(courses);
});

// Get course by ID
export const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id)
    .populate('educator', 'name email')
    .populate('courseRatings.student', 'name')
    .populate('enrolledStudents', 'name email');
  
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  res.json(course);
});

// Update course
export const updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  // Check if user is the educator
  if (course.educator.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this course');
  }

  const updatedCourse = await Course.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('educator', 'name email')
   .populate('courseRatings.student', 'name');

  res.json(updatedCourse);
});

// Delete course
export const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  // Check if user is the educator
  if (course.educator.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this course');
  }

  await course.deleteOne();
  res.json({ message: 'Course removed' });
});

// Add rating to course
export const addCourseRating = asyncHandler(async (req, res) => {
  const { rating, review } = req.body;
  const courseId = req.params.id;

  const course = await Course.findById(courseId);
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  // Check if user is enrolled
  const isEnrolled = course.enrolledStudents.includes(req.user._id);
  if (!isEnrolled) {
    res.status(403);
    throw new Error('Must be enrolled to rate this course');
  }

  // Check if user has already rated
  const existingRating = course.courseRatings.find(
    r => r.student.toString() === req.user._id.toString()
  );

  if (existingRating) {
    existingRating.rating = rating;
    existingRating.review = review;
  } else {
    course.courseRatings.push({
      student: req.user._id,
      rating,
      review
    });
  }

  await course.save();
  res.json(course);
});

// Get educator's courses
export const getEducatorCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({ educator: req.user._id })
    .select('courseTitle courseThumbnail coursePrice educator courseRatings isPublished')
    .populate('educator', 'name email')
    .populate('courseRatings.student', 'name');
  
  res.json(courses);
});

export const enrollCourse = async (req, res) => {
  try {
    const { courseId, orderId } = req.body;

    // Capture the payment
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    const capture = await paypal.client().execute(request);

    if (capture.result.status !== 'COMPLETED') {
      return res.status(400).json({ message: 'Payment not successful' });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      studentId: req.user._id,
      courseId: courseId
    });
    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Get course details
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      studentId: req.user._id,
      courseId: courseId,
      paymentId: capture.result.id,
      orderId: orderId,
      amount: course.coursePrice,
      status: 'completed',
      progress: []
    });

    res.status(201).json({
      message: 'Enrollment successful',
      enrollment
    });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    res.status(500).json({ message: 'Error enrolling in course' });
  }
};
