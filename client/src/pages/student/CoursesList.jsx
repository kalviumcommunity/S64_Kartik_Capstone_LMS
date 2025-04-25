import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import SearchBar from '../../components/student/SearchBar';
import { useNavigate, useParams } from 'react-router-dom';
import CourseCard from '../../components/student/CourseCard';

const CoursesList = () => {
  const { allCourses } = useContext(AppContext);
  const navigate = useNavigate();
  const { input } = useParams(); // Get the 'input' parameter from the URL (if any)
  const [filteredCourses, setFilteredCourses] = useState([]);
  
  useEffect(() => {
    // Make sure allCourses exists and has items
    if (allCourses && allCourses.length > 0) {
      if (input) {
        // Filter courses based on input
        const filtered = allCourses.filter((course) => {
          // Null check for course and course.title
          return course && course.title && 
                 course.title.toLowerCase().includes(input.toLowerCase());
        });
        setFilteredCourses(filtered);
      } else {
        // If no input, show all courses
        setFilteredCourses([...allCourses]);
      }
    } else {
      // No courses available
      setFilteredCourses([]);
    }
  }, [allCourses, input]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Course List</h1>
        <div className="breadcrumbs flex items-center">
          <button 
            className="text-blue-500 hover:underline"
            onClick={() => navigate('/')}
          >
            Home
          </button>
          <span className="mx-2">/</span>
          <span>Course List</span>
        </div>
      </div>
      
      {/* Your SearchBar component doesn't need any props */}
      <SearchBar />
      
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredCourses.map((course, index) => (
            <CourseCard key={course.id || index} course={course} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-lg text-gray-600">
            {input ? `No courses found matching "${input}"` : "No courses available"}
          </p>
        </div>
      )}
    </div>
  );
};

export default CoursesList;