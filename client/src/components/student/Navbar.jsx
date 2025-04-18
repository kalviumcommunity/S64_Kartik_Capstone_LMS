import React from 'react'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'

const Navbar = () => {

  const location = useLocation();
  const isCourseListPage = location.pathname.includes('/courses-list');
  return (
    <div className={`flex items-centor justify-between px-4 sm:px-10 md:py-14 lg:px-36 border-b border-gray-500 py-4 ${isCourseListPage ? 'bg-white' : 'bg-cyan-100/70'}`}>  
      <img src={assets.logo} alt="logo" className='w-28 lg:w-32 cursor-pointer' />
      <div className='hidden md:flex items-center gap-5 text-gray-500' >  
        <div>
          <button>Become Educator</button>
          <Link to="/my-enrollments">My Enrollments</Link>
        </div>
        <button className='bg-blue-600 text-white px-5 py-2'>Create Account</button>
      </div>
    </div>
  )
}

export default Navbar
