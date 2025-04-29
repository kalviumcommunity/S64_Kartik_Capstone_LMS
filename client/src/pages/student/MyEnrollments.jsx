import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { Line } from 'rc-progress';
import YouTube from 'react-youtube';
import * as jwt_decode from 'jwt-decode';
import axios from 'axios';

const MyEnrollments = () => {
  const { enrolledCourses, setEnrolledCourses } = useContext(AppContext);
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwt_decode.jwtDecode(token);
          const currentTime = Date.now() / 1000;
          if (decoded.exp && decoded.exp < currentTime) {
            localStorage.removeItem("token");
            setIsAuthenticated(false);
          } else {
            setIsAuthenticated(true);
          }
        } catch {
          localStorage.removeItem("token");
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    checkAuth();
    window.addEventListener('authChanged', checkAuth);
    return () => window.removeEventListener('authChanged', checkAuth);
  }, []);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get('http://localhost:5000/api/student/enrolled-courses', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setEnrolledCourses(response.data);
      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
      }
    };

    if (isAuthenticated) {
      fetchEnrolledCourses();
    }
  }, [isAuthenticated, setEnrolledCourses]);

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Calculate course duration from course content
  const calculateCourseDuration = (course) => {
    if (!course || !course.courseContent) return "N/A";

    let totalMinutes = 0;
    course.courseContent.forEach(chapter => {
      chapter.chapterContent.forEach(lecture => {
        totalMinutes += lecture.lectureDuration || 0;
      });
    });

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0) {
      return `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`;
    }
    return `${minutes}m`;
  };

  // Calculate completion percentage
  const calculateProgress = (course) => {
    if (!course.progress || !course.totalLectures) return 0;
    return (course.progress / course.totalLectures) * 100;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // This will be followed by navigation to login page
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 md:px-8 lg:px-16 py-4 sm:py-8 bg-gradient-to-b from-white to-blue-50 min-h-screen">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-10 text-white mx-1 sm:mx-2 md:mx-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold pb-1 sm:pb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 mr-2 sm:mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              My Learning Journey
            </h1>
            <p className="text-blue-100 mt-2 sm:mt-3 text-sm sm:text-base md:text-lg max-w-2xl">
              Continue your learning path and track your progress
            </p>
          </div>
          <button 
            onClick={() => navigate('/courses-list')} 
            className="mt-3 sm:mt-4 md:mt-0 px-4 sm:px-6 py-2 sm:py-3 bg-white text-blue-600 font-bold rounded-lg sm:rounded-xl hover:bg-blue-50 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center text-sm sm:text-base"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Explore New Courses
          </button>
        </div>
      </div>

      {/* Course Cards Grid */}
      {enrolledCourses && enrolledCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mx-1 sm:mx-2 md:mx-4">
          {enrolledCourses.map((course, index) => (
            <div 
              key={course._id || index} 
              onClick={() => navigate(`/player/${course._id}`)}
              className="bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-blue-100 cursor-pointer transform hover:-translate-y-1"
            >
              {/* Course Image Banner */}
              <div className="relative h-32 sm:h-40 md:h-48 overflow-hidden">
                <img 
                  src={course.courseThumbnail} 
                  alt={course.courseTitle} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 sm:p-4">
                  <span className={`px-2 sm:px-4 py-1 text-xs sm:text-sm font-bold rounded-full ${
                    calculateProgress(course) === 100 
                      ? 'bg-green-500 text-white' 
                      : 'bg-blue-500 text-white'
                  }`}>
                    {calculateProgress(course) === 100 ? 'Completed' : 'In Progress'}
                  </span>
                </div>
              </div>

              {/* Course Info */}
              <div className="p-3 sm:p-4 md:p-6">
                <h3 className="font-bold text-base sm:text-lg md:text-xl text-gray-800 line-clamp-2">{course.courseTitle}</h3>
                {course.instructor && (
                  <p className="text-gray-600 mt-1 flex items-center text-xs sm:text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    by {course.instructor}
                  </p>
                )}
                
                <div className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-xs sm:text-sm mb-1">
                      <span className="font-medium text-gray-700">
                        {course.progress && course.totalLectures
                          ? `${course.progress}/${course.totalLectures} Lectures`
                          : '0/10 Lectures'
                        }
                      </span>
                      <span className="font-medium text-blue-600">
                        {calculateProgress(course)}%
                      </span>
                    </div>
                    <Line 
                      percent={calculateProgress(course)} 
                      strokeWidth={2} 
                      strokeColor="#3b82f6" 
                      trailWidth={2}
                      trailColor="#e5e7eb"
                      className="rounded-full"
                    />
                  </div>
                  
                  {/* Course Duration */}
                  <div className="flex items-center text-gray-600 text-xs sm:text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">
                      {calculateCourseDuration(course)}
                    </span>
                  </div>
                </div>

                {/* Continue Button */}
                <button className="w-full mt-4 sm:mt-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg sm:rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center text-sm sm:text-base">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Continue Learning
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Empty state
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-12 text-center mx-1 sm:mx-2 md:mx-4">
          <div className="flex flex-col items-center justify-center">
            <div className="w-20 h-20 sm:w-32 sm:h-32 bg-blue-100 rounded-full flex items-center justify-center mb-4 sm:mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 sm:h-16 sm:w-16 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2 sm:mb-3">No Enrolled Courses</h2>
            <p className="text-gray-600 text-sm sm:text-base md:text-lg mb-4 sm:mb-6 md:mb-8 max-w-md mx-auto">
              Start your learning journey by enrolling in courses that match your interests and career goals.
            </p>
            <button 
              onClick={() => navigate('/courses-list')}
              className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg sm:rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center text-sm sm:text-base"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Browse Courses
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyEnrollments;