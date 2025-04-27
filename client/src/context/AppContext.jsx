import { createContext, useState, useEffect } from "react";
import { dummyCourses } from "../assets/assets";
import { Navigate } from "react-router-dom";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const currency = import.meta.env.VITE_CURRENCY || "$";

  const [allCourses, setAllCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    fetchAllCourses();
    checkEducatorStatus();
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
    refreshCourses: fetchAllCourses
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};