import React from 'react'
import { dummyEducatorData, assets } from '../../assets/assets'
import { Link } from 'react-router-dom'

const NavBar = () => {
  const educatorData = dummyEducatorData
  const userName = localStorage.getItem('userName') || 'Developer'

  return (
    <nav className="bg-white shadow-md border-b border-gray-200 py-3 px-4 md:px-8 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
        <img src={assets.logo} alt="logo" className="w-28 lg:w-32" />
      </Link>
      <div className="flex items-center gap-4">
        <span className="text-gray-700 font-medium text-base">
          Hi, {userName}
        </span>
        <img
          src={assets.profile_img}
          alt="user"
          className="w-10 h-10 rounded-full border border-gray-200 shadow-sm object-cover"
        />
      </div>
    </nav>
  )
}

export default NavBar
