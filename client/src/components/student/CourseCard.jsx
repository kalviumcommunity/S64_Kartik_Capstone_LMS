import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useEnrollment } from '../../contexts/EnrollmentContext';
import { Link } from 'react-router-dom';
import { assets } from '../../assets/assets';

const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { enrollCourse } = useEnrollment();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleEnroll = async () => {
    try {
      setLoading(true);
      setError(null);
      await enrollCourse(course._id);
      setIsEnrolled(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewCourse = () => {
    navigate(`/course/${course._id}`);
  };

  if (!course) {
    return null; // Return nothing if course data is missing
  }
  
  // Calculate the rating for this specific course
  const rating = calculateRating(course);
  
  // Get the number of ratings/reviews if available, otherwise use a placeholder
  const reviewCount = course.reviews?.length || course.courseRatings?.length || 0;

  // Calculate discounted price
  const discountedPrice = course.discount 
    ? (course.coursePrice - (course.discount * course.coursePrice) / 100).toFixed(2)
    : course.coursePrice.toFixed(2);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img
        src={course.courseThumbnail}
        alt={course.courseTitle}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{course.courseTitle}</h3>
        <p className="text-gray-600 mb-4">{course.courseDescription}</p>
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold">${course.coursePrice}</span>
          {isEnrolled ? (
            <button
              onClick={handleViewCourse}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              View Course
            </button>
          ) : (
            <button
              onClick={handleEnroll}
              disabled={loading}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
            >
              {loading ? 'Enrolling...' : 'Enroll Now'}
            </button>
          )}
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default CourseCard;