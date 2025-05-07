import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = ({ children }) => {
  const { currentUser, userRole, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is logged in, replace the current history entry
    if (currentUser) {
      const redirectPath = (() => {
        switch (userRole) {
          case "admin":
            return "/admin/dashboard";
          case "entrepreneur":
            return "/entrepreneur/dashboard";
          case "investor":
            return "/investor/dashboard";
          default:
            return "/";
        }
      })();
      
      // Replace the current history entry with the dashboard path
      window.history.replaceState(null, "", redirectPath);
    }
  }, [currentUser, userRole]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (currentUser) {
    // Redirect to appropriate dashboard based on role
    switch (userRole) {
      case "admin":
        return <Navigate to="/admin/dashboard" replace />;
      case "entrepreneur":
        return <Navigate to="/entrepreneur/dashboard" replace />;
      case "investor":
        return <Navigate to="/investor/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default PublicRoute; 