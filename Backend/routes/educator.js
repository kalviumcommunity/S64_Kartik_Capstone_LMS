import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getEnrolledStudents } from '../controllers/educatorController.js';

const router = express.Router();

// Get enrolled students for a course
router.get('/courses/:courseId/enrolled-students', authenticateToken, getEnrolledStudents);

export default router; 