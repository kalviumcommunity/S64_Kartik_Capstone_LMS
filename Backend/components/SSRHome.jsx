import React from 'react';

const SSRHome = ({ courses, testimonials, stats }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Welcome to Our LMS Platform
          </h1>
          <p className="text-xl mb-8">
            Server-Side Rendered with Dynamic Data
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white/20 p-6 rounded-lg">
              <h3 className="text-2xl font-bold">{stats.totalCourses}</h3>
              <p>Total Courses</p>
            </div>
            <div className="bg-white/20 p-6 rounded-lg">
              <h3 className="text-2xl font-bold">{stats.totalStudents}</h3>
              <p>Active Students</p>
            </div>
            <div className="bg-white/20 p-6 rounded-lg">
              <h3 className="text-2xl font-bold">{stats.totalEducators}</h3>
              <p>Expert Educators</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Featured Courses (Server-Rendered)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div key={course.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                  <p className="text-gray-600 mb-4">{course.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-600 font-semibold">${course.price}</span>
                    <span className="text-sm text-gray-500">{course.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Student Testimonials (Server-Rendered)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-4">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.course}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SSR Info Section */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Server-Side Rendering Demo
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            This page is rendered on the server with dynamic data. 
            You can view the source code to see the pre-rendered HTML!
          </p>
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold mb-4">How to verify SSR is working:</h3>
            <ol className="text-left space-y-2">
              <li>1. Right-click on this page and select "View Page Source"</li>
              <li>2. You should see the HTML content already rendered</li>
              <li>3. The dynamic data (courses, testimonials, stats) should be visible in the source</li>
              <li>4. This proves the content was rendered on the server, not just in the browser</li>
            </ol>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SSRHome; 