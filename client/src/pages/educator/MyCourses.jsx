import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets'

const MyCourses = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

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
    <div className="p-8">
      <h2 className="text-lg font-semibold mb-4">My Courses</h2>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-600">
              <th className="py-2 px-4 text-left font-medium">Thumbnail</th>
              <th className="py-2 px-4 text-left font-medium">Title</th>
              <th className="py-2 px-4 text-left font-medium">Price</th>
              <th className="py-2 px-4 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course._id} className="border-b last:border-b-0">
                <td className="py-2 px-4">
                  <img
                    src={course.thumbnail || assets.course_1_thumbnail}
                    alt={course.title}
                    className="w-16 h-10 rounded object-cover border"
                    onError={e => { e.target.onerror = null; e.target.src = assets.course_1_thumbnail; }}
                  />
                </td>
                <td className="py-2 px-4">{course.title}</td>
                <td className="py-2 px-4">{course.price}</td>
                <td className="py-2 px-4">{course.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MyCourses
