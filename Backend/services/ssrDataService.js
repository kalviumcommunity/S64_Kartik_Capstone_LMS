// Simulated data service for SSR demo
// In a real application, this would fetch from your database

import Course from '../models/Course.js';
import User from '../models/User.js';

// Fetch real data for SSR
export const getSSRData = async () => {
  // Fetch up to 6 published courses
  const courses = await Course.find({ isPublished: true })
    .sort({ createdAt: -1 })
    .limit(6)
    .select('courseTitle courseDescription coursePrice courseThumbnail courseContent educator')
    .populate({ path: 'educator', select: 'name avatar' })
    .lean();

  // Fetch testimonials from courseRatings (latest 6 reviews)
  const courseDocs = await Course.find({ isPublished: true, courseRatings: { $exists: true, $not: { $size: 0 } } })
    .select('courseTitle courseRatings')
    .populate({ path: 'courseRatings.student', select: 'name avatar' })
    .lean();
  let testimonials = [];
  courseDocs.forEach(course => {
    (course.courseRatings || []).forEach(rating => {
      if (rating.review) {
        testimonials.push({
          name: rating.student?.name || 'Anonymous',
          avatar: rating.student?.avatar || '',
          course: course.courseTitle,
          quote: rating.review,
          rating: rating.rating
        });
      }
    });
  });
  testimonials = testimonials.slice(0, 6);

  // Stats
  const [totalCourses, totalStudents, totalEducators] = await Promise.all([
    Course.countDocuments({ isPublished: true }),
    User.countDocuments({ role: 'student' }),
    User.countDocuments({ role: 'educator' })
  ]);

  const stats = {
    totalCourses,
    totalStudents,
    totalEducators
  };

  // Map courses to match SSRHome fields
  const mappedCourses = courses.map(course => ({
    id: course._id.toString(),
    title: course.courseTitle,
    description: course.courseDescription,
    price: course.coursePrice,
    thumbnail: course.courseThumbnail,
    educator: course.educator?.name || 'Educator',
    duration: `${(course.courseContent || []).reduce((acc, ch) => acc + (ch.lectures ? ch.lectures.length : 0), 0)} lectures` // simple count
  }));

  return {
    courses: mappedCourses,
    testimonials,
    stats
  };
};

// Function to get data for a specific course
export const getCourseData = async (courseId) => {
  const course = await Course.findById(courseId)
    .select('courseTitle courseDescription coursePrice courseThumbnail courseContent educator')
    .populate({ path: 'educator', select: 'name avatar' })
    .lean();
  if (!course) return null;
  return {
    id: course._id.toString(),
    title: course.courseTitle,
    description: course.courseDescription,
    price: course.coursePrice,
    thumbnail: course.courseThumbnail,
    educator: course.educator?.name || 'Educator',
    duration: `${(course.courseContent || []).reduce((acc, ch) => acc + (ch.lectures ? ch.lectures.length : 0), 0)} lectures`
  };
};

// Function to get platform statistics
export const getPlatformStats = async () => {
  const [totalCourses, totalStudents, totalEducators] = await Promise.all([
    Course.countDocuments({ isPublished: true }),
    User.countDocuments({ role: 'student' }),
    User.countDocuments({ role: 'educator' })
  ]);
  return {
    totalCourses,
    totalStudents,
    totalEducators
  };
}; 