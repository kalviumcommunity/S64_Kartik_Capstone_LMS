import React, { useState } from 'react'
import { assets } from '../../assets/assets'

const dummyCourses = [
  {
    img: assets.course_1_thumbnail,
    title: 'Build Text to Image SaaS App in React JS',
    earnings: '$150',
    students: 25,
    live: true,
  },
  {
    img: assets.course_1_thumbnail,
    title: 'Build Text to Image SaaS App in React JS',
    earnings: '$100',
    students: 28,
    live: false,
  },
  {
    img: assets.course_1_thumbnail,
    title: 'Build Text to Image SaaS App in React JS',
    earnings: '$150',
    students: 22,
    live: true,
  },
  {
    img: assets.course_1_thumbnail,
    title: 'Build Text to Image SaaS App in React JS',
    earnings: '$200',
    students: 8,
    live: true,
  },
  {
    img: assets.course_1_thumbnail,
    title: 'Build Text to Image SaaS App in React JS',
    earnings: '$250',
    students: 15,
    live: true,
  },
]

const MyCourses = () => {
  const [courses, setCourses] = useState(dummyCourses)

  const handleToggle = idx => {
    setCourses(prev => prev.map((c, i) => i === idx ? { ...c, live: !c.live } : c))
  }

  return (
    <div className="p-8">
      <h2 className="text-lg font-semibold mb-4">My Courses</h2>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-600">
              <th className="py-2 px-4 text-left font-medium">All Courses</th>
              <th className="py-2 px-4 text-left font-medium">Earnings</th>
              <th className="py-2 px-4 text-left font-medium">Students</th>
              <th className="py-2 px-4 text-left font-medium">Course Status</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course, idx) => (
              <tr key={idx} className="border-b last:border-b-0">
                <td className="py-2 px-4 flex items-center gap-3">
                  <img src={course.img} alt={course.title} className="w-16 h-10 rounded object-cover" />
                  {course.title}
                </td>
                <td className="py-2 px-4">{course.earnings}</td>
                <td className="py-2 px-4">{course.students}</td>
                <td className="py-2 px-4 flex items-center gap-2">
                  <button
                    onClick={() => handleToggle(idx)}
                    className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${course.live ? 'bg-blue-500' : 'bg-gray-300'}`}
                  >
                    <span
                      className={`inline-block w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200 ${course.live ? 'translate-x-4' : ''}`}
                    />
                  </button>
                  <span className={`text-sm font-medium ${course.live ? 'text-blue-600' : 'text-gray-500'}`}>{course.live ? 'Live' : 'Private'}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MyCourses
