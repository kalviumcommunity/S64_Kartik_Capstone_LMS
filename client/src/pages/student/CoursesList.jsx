import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import SearchBar from "../../components/student/SearchBar";
import { useNavigate, useParams } from "react-router-dom";
import CourseCard from "../../components/student/CourseCard";
import Footer from "../../components/student/Footer";

const CoursesList = () => {
  const { allCourses } = useContext(AppContext);
  const navigate = useNavigate();
  const { input } = useParams(); // Get the 'input' parameter from the URL
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState(input || "");

  // Filter courses whenever allCourses or searchTerm changes
  useEffect(() => {
    if (allCourses && allCourses.length > 0) {
      const tempCourses = allCourses.slice();
      
      if (searchTerm) {
        setFilteredCourses(
          tempCourses.filter((item) =>
            item.courseTitle.toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
      } else {
        setFilteredCourses(tempCourses);
      }
    }
  }, [allCourses, searchTerm]); // Add dependencies to ensure effect runs when these change

  // Set initial search term from URL parameter
  useEffect(() => {
    if (input) {
      setSearchTerm(input);
    }
  }, [input]);

  const handleSearch = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8 bg-gradient-to-b from-blue-50 to-gray-50 min-h-screen">
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
            <div>
              <h1 className="text-4xl font-bold mb-4 text-gray-800 border-b-2 border-blue-500 pb-2 inline-block">
                Course List
              </h1>
              <div className="breadcrumbs flex items-center text-sm text-gray-600">
                <button
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium"
                  onClick={() => navigate("/")}
                >
                  Home
                </button>
                <span className="mx-2">/</span>
                <span className="font-medium">Course List</span>
                {searchTerm && (
                  <>
                    <span className="mx-2">/</span>
                    <span className="italic">Search: "{searchTerm}"</span>
                  </>
                )}
              </div>
            </div>
            
            <div className="w-full lg:w-1/3">
              <SearchBar onSearch={handleSearch} initialValue={searchTerm} />
            </div>
          </div>
        </div>

        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {filteredCourses.map((course, index) => (
              <CourseCard key={course.id || index} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow-md border border-gray-100">
            <p className="text-xl text-gray-600">
              {searchTerm
                ? `No courses found matching "${searchTerm}"`
                : "No courses available"}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default CoursesList;