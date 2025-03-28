import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-emerald-600 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-white text-xl font-bold">
            Splitwise
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <Link 
                to="/dashboard" 
                className="text-emerald-100 hover:text-white"
              >
                Dashboard
              </Link>
              <Link 
                to="/groups" 
                className="text-emerald-100 hover:text-white"
              >
                Groups
              </Link>
              <div className="relative group">
                <button className="flex items-center space-x-1 text-emerald-100 hover:text-white">
                  <span>{user?.name || user?.email}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute right-0 w-48 py-2 mt-2 bg-white rounded-md shadow-xl hidden group-hover:block">
                  <Link 
                    to="/profile" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link 
                to="/login" 
                className="text-emerald-100 hover:text-white"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-400"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
