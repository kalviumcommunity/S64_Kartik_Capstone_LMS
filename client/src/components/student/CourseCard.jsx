import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';

const CourseCard = ({ course }) => {
  const { currency, calculateRating } = useContext(AppContext);
  
  // Calculate the rating for this specific course
  const rating = calculateRating(course);
  
  // Get the number of ratings/reviews if available, otherwise use a placeholder
  const reviewCount = course.reviews?.length || 0;

  return (
    <Link
      to={`/courses/${course._id}`}
      onClick={() => window.scrollTo(0, 0)}
      className='group flex flex-col bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1'
    >
      <div className='relative overflow-hidden'>
        <img
          className='w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105'
          src={course.courseThumbnail}
          alt={course.courseTitle}
        />
        {course.discount > 0 && (
          <div className='absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium'>
            {course.discount}% OFF
          </div>
        )}
      </div>
      
      <div className='flex-1 p-4 flex flex-col justify-between text-left'>
        <div>
          <h3 className='text-lg font-bold text-gray-800 line-clamp-2 mb-1'>{course.courseTitle}</h3>
          <p className='text-gray-600 text-sm mb-2 flex items-center'>
            <span className='inline-block mr-1'>by</span> 
            <span className='font-medium'>{course.educator.name}</span>
          </p>
        </div>
        
        <div className='mt-2'>
          <div className='flex items-center mb-2'>
            <div className='flex mr-2'>
              {[...Array(Math.round(rating))].map((_, i) => (
                <img key={i} src={assets.star} alt="star" className='w-4 h-4' />
              ))}
              {/* Show partial star if needed */}
              {rating % 1 >= 0.5 && rating < 5 && (
                <img src={assets.halfStar || assets.star} alt="half star" className='w-4 h-4' />
              )}
              {/* Show empty stars to always display 5 stars total */}
              {[...Array(5 - Math.ceil(rating))].map((_, i) => (
                <img key={i} src={assets.emptyStar || assets.star} alt="empty star" className='w-4 h-4 opacity-40' />
              ))}
            </div>
            <p className='text-sm font-medium text-gray-700'>{rating.toFixed(1)}</p>
            <span className='mx-2 text-gray-400'>•</span>
            <p className='text-sm text-gray-500'>
              {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
            </p>
          </div>
          
          <div className='mt-3 flex items-center'>
            <p className='text-xl font-bold text-indigo-600'>
              {currency}{(course.coursePrice - (course.discount * course.coursePrice) / 100).toFixed(2)}
            </p>
            {course.discount > 0 && (
              <span className="line-through text-gray-400 text-sm ml-2">{currency}{course.coursePrice.toFixed(2)}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;