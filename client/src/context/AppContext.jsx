import React, { createContext, useContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { dummyCourses } from '../assets/assets';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY || '$';

  const [allCourses, setAllCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [user, setUser] = useState(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsEducator(parsedUser.role === 'educator');
      
      // Set axios default header for authentication
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsEducator(false);
    delete axios.defaults.headers.common['Authorization'];
    setEnrolledCourses([]);
  };

  const fetchAllCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`${API_BASE_URL}/api/courses`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (Array.isArray(response.data)) {
        setAllCourses(response.data);
      } else {
        console.error('Expected array of courses but got:', response.data);
        setAllCourses([]);
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to load courses. Please try again later.');
      setAllCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const checkEducatorStatus = () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      setIsEducator(storedUser?.role === 'educator');
    } catch (err) {
      console.error('Error checking educator status:', err);
      setIsEducator(false);
    }
  };

  const calculateRating = (course) => {
    if (!course?.courseRatings?.length) return 0;
    return course.courseRatings.reduce((acc, rating) => acc + rating.rating, 0) / course.courseRatings.length;
  };

  const calculateCourseDuration = (course) => {
    if (!course?.courseContent) return 'N/A';
    
    const totalMinutes = course.courseContent.reduce((acc, chapter) => 
      acc + chapter.chapterContent.reduce((sum, lecture) => sum + (lecture.lectureDuration || 0), 0), 0);
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  const calculateTotalLectures = (course) => {
    if (!course?.courseContent) return 0;
    return course.courseContent.reduce((acc, chapter) => acc + chapter.chapterContent.length, 0);
  };

  const calculateProgress = (course) => {
    if (!course?.courseContent) return 0;
    return Math.floor(Math.random() * calculateTotalLectures(course));
  };

  const fetchUserEnrolledCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setEnrolledCourses([]);
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/api/enrollments/student/enrolled-courses`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (Array.isArray(response.data)) {
        const coursesWithProgress = response.data.map(enrollment => ({
          ...enrollment.courseId,
          progress: enrollment.progress.length || 0,
          totalLectures: calculateTotalLectures(enrollment.courseId)
        }));
        setEnrolledCourses(coursesWithProgress);
      } else {
        console.error('Expected array of enrolled courses but got:', response.data);
        setEnrolledCourses([]);
      }
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
      setEnrolledCourses([]);
    }
  };

  useEffect(() => {
    fetchAllCourses();
    checkEducatorStatus();
    if (user) {
      fetchUserEnrolledCourses();
    }
  }, [user]);

  const value = {
    currency,
    allCourses,
    loading,
    error,
    Navigate,
    calculateRating,
    isEducator,
    setIsEducator,
    refreshCourses: fetchAllCourses,
    enrolledCourses,
    setEnrolledCourses,
    fetchUserEnrolledCourses,
    calculateCourseDuration,
    user,
    setUser,
    logout
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};