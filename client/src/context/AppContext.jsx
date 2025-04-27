import React, { createContext, useContext, useState, useEffect } from 'react';
import { dummyCourses } from "../assets/assets";
import { Navigate } from "react-router-dom";

export const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppContextProvider = (props) => {
  const currency = import.meta.env.VITE_CURRENCY || "$";

  const [allCourses, setAllCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  const fetchAllCourses = async() => {
    try {
      setLoading(true);
      // In a real app, this would be an API call
      // const response = await fetch('/api/courses');
      // const data = await response.json();
      // setAllCourses(data);
      
      // Using dummy data for now
      setAllCourses(dummyCourses);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError("Failed to load courses. Please try again later.");
      setLoading(false);
    }
  };

  // Check if user is an educator
  const checkEducatorStatus = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.role === "educator") {
        setIsEducator(true);
      } else {
        setIsEducator(false);
      }
    } catch (err) {
      console.error("Error checking educator status:", err);
      setIsEducator(false);
    }
  };

  const calculateRating = (course) => {
    if (!course || !course.courseRatings || course.courseRatings.length === 0) {
      return 0;
    }
    
    let totalRating = 0;
    course.courseRatings.forEach(rating => {
      totalRating += rating.rating;
    });
    
    return totalRating / course.courseRatings.length;
  };

  const calculateCourseDuration = (course) => {
    if (!course || !course.courseContent) return 'N/A';
    
    let totalMinutes = 0;
    course.courseContent.forEach(chapter => {
      chapter.chapterContent.forEach(lecture => {
        totalMinutes += lecture.lectureDuration || 0;
      });
    });
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  const calculateTotalLectures = (course) => {
    if (!course || !course.courseContent) return 0;
    let total = 0;
    course.courseContent.forEach(chapter => {
      total += chapter.chapterContent.length;
    });
    return total;
  };

  const calculateProgress = (course) => {
    if (!course || !course.courseContent) return 0;
    // For now, we'll return a dummy progress value
    // In a real app, this would come from the user's progress data
    return Math.floor(Math.random() * calculateTotalLectures(course));
  };

  const fetchUserEnrolledCourses = async() => {
    // Add progress and totalLectures to each course
    const coursesWithProgress = dummyCourses.map(course => ({
      ...course,
      progress: calculateProgress(course),
      totalLectures: calculateTotalLectures(course)
    }));
    setEnrolledCourses(coursesWithProgress);
  }

  useEffect(() => {
    fetchAllCourses();
    checkEducatorStatus();
    fetchUserEnrolledCourses();
  }, []);

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
    fetchUserEnrolledCourses,
    calculateCourseDuration
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};