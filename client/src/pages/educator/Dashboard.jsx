import React, { useEffect, useState } from 'react'
import NavBar from '../../components/educator/NavBar'
import Sidebar from '../../components/educator/Sidebar'
import { assets } from '../../assets/assets'

const Dashboard = () => {
  const [summaryData, setSummaryData] = useState([
    { icon: assets.user_icon, value: 0, label: 'Total Enrolments' },
    { icon: assets.my_course_icon, value: 0, label: 'Total Courses' },
    { icon: assets.earning_icon, value: '$0', label: 'Total Earnings' },
  ])
  const [latestEnrollments, setLatestEnrollments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Replace these URLs with your actual backend endpoints
        const summaryRes = await fetch('/api/educator/summary')
        const enrollmentsRes = await fetch('/api/educator/latest-enrollments')
        if (!summaryRes.ok || !enrollmentsRes.ok) throw new Error('Failed to fetch')
        const summary = await summaryRes.json()
        const enrollments = await enrollmentsRes.json()
        setSummaryData([
          { icon: assets.user_icon, value: summary.totalEnrolments, label: 'Total Enrolments' },
          { icon: assets.my_course_icon, value: summary.totalCourses, label: 'Total Courses' },
          { icon: assets.earning_icon, value: `$${summary.totalEarnings}`, label: 'Total Earnings' },
        ])
        setLatestEnrollments(enrollments)
      } catch (err) {
        setError('Could not load dashboard data.')
      } finally {
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [])

  if (loading) return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  if (error) return <div className="flex min-h-screen items-center justify-center text-red-500">{error}</div>

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* <Sidebar /> */}
      <div className="flex-1">
        {/* <NavBar /> */}
        <div className="p-6">
          {/* Summary Cards */}
          <div className="flex gap-6 mb-8">
            {summaryData.map((item, idx) => (
              <div
                key={idx}
                className={`flex-1 flex items-center gap-4 bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-4 ${idx === 1 ? 'border-2 border-blue-400' : ''}`}
              >
                <img src={item.icon} alt="icon" className="w-10 h-10" />
                <div>
                  <div className="text-2xl font-bold text-gray-800">{item.value}</div>
                  <div className="text-gray-500 text-sm">{item.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Latest Enrollments Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Latest Enrolments</h2>
            <div className="overflow-x-auto">
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
                  {latestEnrollments.map((enroll, idx) => (
                    <tr key={idx} className="border-b last:border-b-0">
                      <td className="py-2 px-4">{idx + 1}</td>
                      <td className="py-2 px-4 flex items-center gap-2">
                        <img src={enroll.student.img || assets.profile_img} alt={enroll.student.name} className="w-8 h-8 rounded-full object-cover" />
                        {enroll.student.name}
                      </td>
                      <td className="py-2 px-4">{enroll.course}</td>
                      <td className="py-2 px-4">{enroll.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
