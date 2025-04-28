import React, { useEffect, useState } from 'react'
import NavBar from '../../components/educator/NavBar'
import Sidebar from '../../components/educator/Sidebar'
import { assets } from '../../assets/assets'

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Static values for now
  const totalEnrollments = 14;
  const totalEarnings = 245;

  useEffect(() => {
    const fetchCourses = async () => {
      const res = await fetch('http://localhost:5000/api/courses');
      const data = await res.json();
      setCourses(data);
      setLoading(false);
    };
    fetchCourses();
  }, []);

  if (loading) return <div className="flex min-h-screen items-center justify-center">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* <Sidebar /> */}
      <div className="flex-1">
        {/* <NavBar /> */}
        <div className="p-6">
          {/* Summary Cards */}
          <div className="flex gap-6 mb-8">
            <div className="flex-1 flex items-center gap-4 bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-4">
              <img src={assets.user_icon} alt="icon" className="w-10 h-10" />
              <div>
                <div className="text-2xl font-bold text-gray-800">{totalEnrollments}</div>
                <div className="text-gray-500 text-sm">Total Enrollments</div>
              </div>
            </div>
            <div className="flex-1 flex items-center gap-4 bg-white rounded-lg shadow-sm border-2 border-blue-400 px-6 py-4">
              <img src={assets.my_course_icon} alt="icon" className="w-10 h-10" />
              <div>
                <div className="text-2xl font-bold text-gray-800">{courses.length}</div>
                <div className="text-gray-500 text-sm">Total Courses</div>
              </div>
            </div>
            <div className="flex-1 flex items-center gap-4 bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-4">
              <img src={assets.earning_icon} alt="icon" className="w-10 h-10" />
              <div>
                <div className="text-2xl font-bold text-gray-800">${totalEarnings}</div>
                <div className="text-gray-500 text-sm">Total Earnings</div>
              </div>
            </div>
          </div>

          {/* Courses Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">All Courses</h2>
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-600">
                  <th className="py-2 px-4 text-left font-medium">Title</th>
                  <th className="py-2 px-4 text-left font-medium">Price</th>
                  <th className="py-2 px-4 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {courses.map(course => (
                  <tr key={course._id} className="border-b last:border-b-0">
                    <td className="py-2 px-4">{course.title}</td>
                    <td className="py-2 px-4">{course.price}</td>
                    <td className="py-2 px-4">{course.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
