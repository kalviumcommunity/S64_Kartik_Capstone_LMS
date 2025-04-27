import React from 'react'
import { Outlet } from 'react-router-dom'
import NavBar from '../../components/educator/NavBar'
import Sidebar from '../../components/educator/Sidebar'

const Educator = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Educator
