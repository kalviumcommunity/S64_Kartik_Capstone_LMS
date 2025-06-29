import React from 'react';

const SSRHome = ({ courses, testimonials, stats }) => {
  return React.createElement('div', { className: 'min-h-screen bg-white' },
    // Hero Section
    React.createElement('section', { className: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20' },
      React.createElement('div', { className: 'container mx-auto px-4 text-center' },
        React.createElement('h1', { className: 'text-5xl font-bold mb-6' },
          'Welcome to Our LMS Platform'
        ),
        React.createElement('p', { className: 'text-xl mb-8' },
          'Server-Side Rendered with Dynamic Data'
        ),
        React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-8 mt-12' },
          React.createElement('div', { className: 'bg-white/20 p-6 rounded-lg' },
            React.createElement('h3', { className: 'text-2xl font-bold' }, stats.totalCourses),
            React.createElement('p', null, 'Total Courses')
          ),
          React.createElement('div', { className: 'bg-white/20 p-6 rounded-lg' },
            React.createElement('h3', { className: 'text-2xl font-bold' }, stats.totalStudents),
            React.createElement('p', null, 'Active Students')
          ),
          React.createElement('div', { className: 'bg-white/20 p-6 rounded-lg' },
            React.createElement('h3', { className: 'text-2xl font-bold' }, stats.totalEducators),
            React.createElement('p', null, 'Expert Educators')
          )
        )
      )
    ),

    // Featured Courses Section
    React.createElement('section', { className: 'py-16 bg-gray-50' },
      React.createElement('div', { className: 'container mx-auto px-4' },
        React.createElement('h2', { className: 'text-3xl font-bold text-center mb-12' },
          'Featured Courses (Server-Rendered)'
        ),
        React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' },
          courses.map((course) =>
            React.createElement('div', { key: course.id, className: 'bg-white rounded-lg shadow-lg overflow-hidden' },
              React.createElement('div', { className: 'p-6' },
                React.createElement('h3', { className: 'text-xl font-semibold mb-2' }, course.title),
                React.createElement('p', { className: 'text-gray-600 mb-4' }, course.description),
                React.createElement('div', { className: 'flex justify-between items-center' },
                  React.createElement('span', { className: 'text-blue-600 font-semibold' }, `$${course.price}`),
                  React.createElement('span', { className: 'text-sm text-gray-500' }, course.duration)
                )
              )
            )
          )
        )
      )
    ),

    // Testimonials Section
    React.createElement('section', { className: 'py-16' },
      React.createElement('div', { className: 'container mx-auto px-4' },
        React.createElement('h2', { className: 'text-3xl font-bold text-center mb-12' },
          'Student Testimonials (Server-Rendered)'
        ),
        React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' },
          testimonials.map((testimonial, index) =>
            React.createElement('div', { key: index, className: 'bg-gray-50 p-6 rounded-lg' },
              React.createElement('p', { className: 'text-gray-700 mb-4' }, `"${testimonial.quote}"`),
              React.createElement('div', { className: 'flex items-center' },
                React.createElement('div', { className: 'w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-4' },
                  testimonial.name.charAt(0)
                ),
                React.createElement('div', null,
                  React.createElement('h4', { className: 'font-semibold' }, testimonial.name),
                  React.createElement('p', { className: 'text-sm text-gray-600' }, testimonial.course)
                )
              )
            )
          )
        )
      )
    ),

    // SSR Info Section
    React.createElement('section', { className: 'py-16 bg-blue-50' },
      React.createElement('div', { className: 'container mx-auto px-4 text-center' },
        React.createElement('h2', { className: 'text-3xl font-bold mb-6' },
          'Server-Side Rendering Demo'
        ),
        React.createElement('p', { className: 'text-lg text-gray-700 mb-8' },
          'This page is rendered on the server with dynamic data. You can view the source code to see the pre-rendered HTML!'
        ),
        React.createElement('div', { className: 'bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto' },
          React.createElement('h3', { className: 'text-xl font-semibold mb-4' }, 'How to verify SSR is working:'),
          React.createElement('ol', { className: 'text-left space-y-2' },
            React.createElement('li', null, '1. Right-click on this page and select "View Page Source"'),
            React.createElement('li', null, '2. You should see the HTML content already rendered'),
            React.createElement('li', null, '3. The dynamic data (courses, testimonials, stats) should be visible in the source'),
            React.createElement('li', null, '4. This proves the content was rendered on the server, not just in the browser')
          )
        )
      )
    )
  );
};

export default SSRHome; 