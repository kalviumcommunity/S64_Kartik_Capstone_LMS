import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  enrollCourse,
  getEnrolledCourses,
  getCourseProgress,
  updateCourseProgress
} from '../controllers/enrollmentController.js';

const router = express.Router();

// Protected routes
router.use(protect);

// Get all enrolled courses
router.get('/student/enrolled-courses', getEnrolledCourses);

// Enroll in a course
router.post('/student/enroll/:courseId', enrollCourse);

// Get course progress
router.get('/student/course/:courseId/progress', getCourseProgress);

// Update course progress
router.put('/student/course/:courseId/progress', updateCourseProgress);

export default router; 