import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.svg";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isEducator } = useContext(AppContext);
  const isCourseListPage = location.pathname.includes("/courses-list");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, [location]); // Re-check when location changes

  const handleCreateAccount = () => {
    navigate("/auth"); // Navigate to auth page for sign up
  };

  const handleLogin = () => {
    navigate("/auth#login"); // Navigate to auth page for login
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <div
      className={`sticky top-0 z-50 flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-200 py-4 shadow-md ${
        isCourseListPage ? "bg-white" : "bg-cyan-100"
      }`}
      style={{ backdropFilter: "blur(8px)" }}
    >
      <Link to="/">
        <img src={logo} alt="logo" className="w-28 lg:w-32 cursor-pointer" />
      </Link>

      <div className="hidden md:flex items-center gap-5 text-gray-500">
        <div className="flex items-center gap-5">
          {isEducator ? (
            <Link to="/educator/dashboard" className="hover:text-blue-600 transition">
              Educator Dashboard
            </Link>
          ) : (
            <button 
              onClick={() => navigate("/educator")}
              className="hover:text-blue-600 transition"
            >
              Become Educator
            </button>
          )}
          |{" "}
          <Link to="/my-enrollments" className="hover:text-blue-600 transition">
            My Enrollments
          </Link>
        </div>

        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-5 py-2 rounded-full hover:bg-red-700 transition duration-300"
          >
            Logout
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={handleLogin}
              className="text-blue-600 hover:underline transition"
            >
              Login
            </button>
            <button
              onClick={handleCreateAccount}
              className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition duration-300"
            >
              Create Account
            </button>
          </div>
        )}
      </div>

      <div className="md:hidden flex items-center gap-2 sm:gap-5 text-gray-500">
        <div className="flex items-center gap-1 sm:gap-2 max-sm:text-xs">
          {isEducator ? (
            <Link to="/educator/dashboard" className="hover:text-blue-600 transition">
              Dashboard
            </Link>
          ) : (
            <button 
              onClick={() => navigate("/educator")}
              className="hover:text-blue-600 transition"
            >
              Become Educator
            </button>
          )}
          |{" "}
          <Link to="/my-enrollments" className="hover:text-blue-600 transition">
            My Enrollments
          </Link>

          <button onClick={isLoggedIn ? handleLogout : handleLogin}>
            <img src={assets.user_icon} alt="User" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;