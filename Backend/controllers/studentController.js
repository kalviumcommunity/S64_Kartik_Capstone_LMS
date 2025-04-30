import Course from '../models/Course.js';
import User from '../models/User.js';

// Enroll in a course
export const enrollInCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const studentId = req.user._id;

        console.log('Enrolling student:', studentId, 'in course:', courseId);

        // Check if course exists
        const course = await Course.findById(courseId);
        if (!course) {
            console.log('Course not found:', courseId);
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if student is already enrolled
        if (course.enrolledStudents.includes(studentId)) {
            console.log('Student already enrolled:', studentId);
            return res.status(400).json({ message: 'Already enrolled in this course' });
        }

        // Add student to course's enrolledStudents array
        course.enrolledStudents.push(studentId);
        await course.save();
        console.log('Added student to course:', course.enrolledStudents);

        // Update user's enrolled courses
        await User.findByIdAndUpdate(studentId, {
            $addToSet: { enrolledCourses: courseId }
        });
        console.log('Updated user enrolled courses');

        res.status(200).json({ message: 'Successfully enrolled in course' });
    } catch (error) {
        console.error('Enrollment error:', error);
        res.status(500).json({ message: 'Error enrolling in course' });
    }
};

// Get enrolled courses for a student
export const getEnrolledCourses = async (req, res) => {
    try {
        const studentId = req.user._id;

        // Find all courses where the student is enrolled
        const enrolledCourses = await Course.find({
            enrolledStudents: studentId
        }).populate('educator', 'name email');

        res.status(200).json(enrolledCourses);
    } catch (error) {
        console.error('Error fetching enrolled courses:', error);
        res.status(500).json({ message: 'Error fetching enrolled courses' });
    }
}; 