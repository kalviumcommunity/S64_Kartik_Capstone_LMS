import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
import asyncHandler from 'express-async-handler';

// Get all enrolled courses for a student
export const getEnrolledCourses = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find({ studentId: req.user._id })
    .populate('courseId')
    .populate('studentId', 'name email');

  res.json(enrollments);
});

// Enroll in a course
export const enrollCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  
  // Check if already enrolled
  const existingEnrollment = await Enrollment.findOne({
    studentId: req.user._id,
    courseId: courseId
  });

  if (existingEnrollment) {
    res.status(400);
    throw new Error('Already enrolled in this course');
  }

  // Check if course exists
  const course = await Course.findById(courseId);
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  // Create enrollment
  const enrollment = await Enrollment.create({
    studentId: req.user._id,
    courseId: courseId,
    paymentId: 'temp_payment_id', // This should be replaced with actual payment ID
    orderId: 'temp_order_id', // This should be replaced with actual order ID
    amount: course.price,
    status: 'completed',
    progress: []
  });

  res.status(201).json(enrollment);
});

// Get course progress
export const getCourseProgress = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  
  const enrollment = await Enrollment.findOne({
    studentId: req.user._id,
    courseId: courseId
  });

  if (!enrollment) {
    res.status(404);
    throw new Error('Not enrolled in this course');
  }

  res.json({ progress: enrollment.progress });
});

// Update course progress
export const updateCourseProgress = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { lectureId } = req.body;

  const enrollment = await Enrollment.findOne({
    studentId: req.user._id,
    courseId: courseId
  });

  if (!enrollment) {
    res.status(404);
    throw new Error('Not enrolled in this course');
  }

  // Update progress for the specific lecture
  const progressIndex = enrollment.progress.findIndex(p => p.lectureId.toString() === lectureId);
  if (progressIndex === -1) {
    enrollment.progress.push({
      lectureId,
      completed: true,
      completedAt: new Date()
    });
  } else {
    enrollment.progress[progressIndex].completed = true;
    enrollment.progress[progressIndex].completedAt = new Date();
  }

  await enrollment.save();
  res.json(enrollment);
}); 