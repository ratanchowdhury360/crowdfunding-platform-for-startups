import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { currentUser, userRole, isAuthenticated } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="bg-background border-b border-accent/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-accent  font-bold text-4xl">
              StartFund
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {userRole === "admin" && (
                  <Link
                    to="/admin/dashboard"
                    className="text-white hover:text-accent"
                  >
                    Admin Dashboard
                  </Link>
                )}
                {userRole === "entrepreneur" && (
                  <>
                    <Link
                      to="/entrepreneur/dashboard"
                      className="text-white hover:text-accent"
                    >
                      My Dashboard
                    </Link>
                    <Link
                      to="/create-campaign"
                      className="bg-accent text-black px-4 py-2 rounded hover:bg-accent/90"
                    >
                      Create Campaign
                    </Link>
                  </>
                )}
                {userRole === "investor" && (
                  <Link
                    to="/investor/dashboard"
                    className="text-white hover:text-accent"
                  >
                    My Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-white hover:text-accent"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/guest" className="text-white hover:text-accent">
                  Browse Projects
                </Link>
                <Link to="/login" className="text-white hover:text-accent">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-accent text-black px-4 py-2 rounded hover:bg-accent/90"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
