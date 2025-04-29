import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { addCourse, getCourses} from '../controllers/courseController.js';

const router = express.Router();

// Protected routes
router.use(protect);

// Course routes
router.post('/', addCourse);
router.get('/', getCourses);
// router.get('/:id', getCourseById);
// router.put('/:id', updateCourse);
// router.delete('/:id', deleteCourse);

export default router;
