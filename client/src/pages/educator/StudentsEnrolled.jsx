import React from 'react'
import { assets } from '../../assets/assets'

const dummyEnrollments = [
  {
    student: 'Richard Sanford',
    img: assets.profile_img_1,
    course: 'Build Text to Image SaaS App in React JS',
    date: '22 Aug, 2024',
  },
  {
    student: 'Enrique Murphy',
    img: assets.profile_img_2,
    course: 'Build AI BG Removal SaaS App in React JS',
    date: '22 Aug, 2024',
  },
  {
    student: 'Alison Powell',
    img: assets.profile_img_3,
    course: 'React Router Complete Course in One Video',
    date: '25 Sep, 2024',
  },
  {
    student: 'Richard Sanford',
    img: assets.profile_img_1,
    course: 'Build Full Stack E-Commerce App in React JS',
    date: '15 Oct, 2024',
  },
  {
    student: 'Enrique Murphy',
    img: assets.profile_img_2,
    course: 'Build AI BG Removal SaaS App in React JS',
    date: '22 Aug, 2024',
  },
  {
    student: 'Alison Powell',
    img: assets.profile_img_3,
    course: 'React Router Complete Course in One Video',
    date: '25 Sep, 2024',
  },
  {
    student: 'Richard Sanford',
    img: assets.profile_img_1,
    course: 'Build Full Stack E-Commerce App in React JS',
    date: '15 Oct, 2024',
  },
]

const StudentsEnrolled = () => {
  return (
    <div className="p-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-600">
              <th className="py-2 px-4 text-left font-medium">#</th>
              <th className="py-2 px-4 text-left font-medium">Student name</th>
              <th className="py-2 px-4 text-left font-medium">Course Title</th>
              <th className="py-2 px-4 text-left font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {dummyEnrollments.map((enroll, idx) => (
              <tr key={idx} className="border-b last:border-b-0">
                <td className="py-2 px-4">{idx + 1}</td>
                <td className="py-2 px-4 flex items-center gap-2">
                  <img src={enroll.img} alt={enroll.student} className="w-8 h-8 rounded-full object-cover" />
                  {enroll.student}
                </td>
                <td className="py-2 px-4">{enroll.course}</td>
                <td className="py-2 px-4">{enroll.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default StudentsEnrolled
