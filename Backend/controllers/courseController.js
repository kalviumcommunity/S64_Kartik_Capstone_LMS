import Course from '../models/Course.js';
import asyncHandler from 'express-async-handler';

// Create a new course
export const addCourse = asyncHandler(async (req, res) => {
  const { title, description, price, thumbnail, status } = req.body;
  const educator = req.user._id;

  const course = await Course.create({
    title,
    description,
    price,
    thumbnail,
    status,
    educator
  });

  res.status(201).json(course);
});

// Get all courses
export const getCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find().populate('educator', 'name email');
  res.json(courses);
});

// Get course by ID
export const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id).populate('educator', 'name email');
  
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
    { new: true }
  );

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
