import express from 'express';
import { addCourse, getCourses } from '../controllers/courseController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/courses - Add a new course (educator only)
router.post('/', authMiddleware, addCourse);

// GET /api/courses - Get all courses
router.get('/', getCourses);

export default router;
