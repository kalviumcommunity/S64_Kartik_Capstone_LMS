import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import CourseCard from './CourseCard';

const CoursesSection = ({ title, description, limit = 4 }) => {
  const { allCourses, loading, error } = useContext(AppContext);

  // Custom props with defaults
  const sectionTitle = title || 'Learn from the best';
  const sectionDescription = description || 
    'Discover our top-rated courses across various categories. From coding and design to business and wellness, our courses are crafted to deliver results.';

  // Show loading state
  if (loading) {
    return (
      <section className='py-16 lg:py-24 bg-gray-50 max-w-full'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center'>
            <h2 className='text-3xl md:text-4xl font-bold text-gray-800 mb-4'>{sectionTitle}</h2>
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section className='py-16 lg:py-24 bg-gray-50 max-w-full'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center'>
            <h2 className='text-3xl md:text-4xl font-bold text-gray-800 mb-4'>{sectionTitle}</h2>
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // No courses available
  if (!allCourses || allCourses.length === 0) {
    return (
      <section className='py-16 lg:py-24 bg-gray-50 max-w-full'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center'>
            <h2 className='text-3xl md:text-4xl font-bold text-gray-800 mb-4'>{sectionTitle}</h2>
            <p className='text-gray-600'>No courses available at the moment. Check back soon!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className='py-16 lg:py-24 bg-gray-50 max-w-full'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-800 mb-4'>{sectionTitle}</h2>
          <p className='text-gray-600 max-w-2xl mx-auto'>
            {sectionDescription}
          </p>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12'>
          {allCourses.slice(0, limit).map((course, index) => (
            <CourseCard key={course._id || index} course={course} />
          ))}
        </div>
        
        {allCourses.length > limit && (
          <div className='text-center'>
            <Link 
              to='/courses-list/' 
              onClick={() => window.scrollTo(0, 0)} 
              className='inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg 
                        text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 
                        transition-colors duration-300 shadow-sm hover:shadow'
            >
              View all courses
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default CoursesSection;