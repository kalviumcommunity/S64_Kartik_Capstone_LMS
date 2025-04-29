import React from 'react';
import { Routes, Route, useMatch, Navigate } from 'react-router-dom';
import { useAppContext } from './context/AppContext';

// Components
import Navbar from './components/student/Navbar';
import Loading from './components/student/Loading';

// Pages
import Home from './pages/student/Home';
import CoursesList from './pages/student/CoursesList';
import CourseDetails from './pages/student/CourseDetails';
import MyEnrollments from './pages/student/MyEnrollments';
import Player from './pages/student/Player';
import Educator from './pages/educator/Educator';
import Dashboard from './pages/educator/Dashboard';
import AddCourse from './pages/educator/AddCourse';
import MyCourses from './pages/educator/MyCourses';
import StudentsEnrolled from './pages/educator/StudentsEnrolled';
import Register from './pages/Register';
import Login from './pages/Login';

const ProtectedRoute = ({ children, requireEducator = false }) => {
  const { user, loading } = useAppContext();
  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" />;
  if (requireEducator && user.role !== 'educator') return <Navigate to="/" />;
  return children;
};

const App = () => {
  const isEducatorRoute = useMatch('/educator/*');

  return (
    <div className="text-default min-h-screen bg-white">
      {!isEducatorRoute && <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/courses-list" element={<CoursesList />} />
        <Route path="/courses-list/:input" element={<CoursesList />} />
        <Route path="/courses/:id" element={<CourseDetails />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route path="/my-enrollments" element={
          <ProtectedRoute>
            <MyEnrollments />
          </ProtectedRoute>
        } />
        <Route path="/player/:courseId" element={
          <ProtectedRoute>
            <Player />
          </ProtectedRoute>
        } />

        {/* Educator Routes */}
        <Route path="/educator" element={
          <ProtectedRoute requireEducator>
            <Educator />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="add-course" element={<AddCourse />} />
          <Route path="my-courses" element={<MyCourses />} />
          <Route path="student-enrolled" element={<StudentsEnrolled />} />
        </Route>

        <Route path="/loading/:path" element={<Loading />} />
      </Routes>
    </div>
  );
};

export default App;
