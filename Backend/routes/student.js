import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { enrollInCourse, getEnrolledCourses } from '../controllers/studentController.js';

const router = express.Router();

// Enrollment routes
router.post('/enroll/:courseId', protect, enrollInCourse);
router.get('/enrolled-courses', protect, getEnrolledCourses);

export default router; 