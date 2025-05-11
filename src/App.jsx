import React from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import DashboardRouter from "./components/DashboardRouter";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import GuestView from "./pages/GuestView";
import AdminDashboard from "./pages/AdminDashboard";
import EntrepreneurDashboard from "./pages/EntrepreneurDashboard";
import InvestorDashboard from "./pages/InvestorDashboard";
import ProjectDetail from "./pages/ProjectDetail";
import CreateCampaign from "./pages/CreateCampaign";
import Payment from "./pages/Payment";
import ProjectList from "./pages/ProjectList";
import PostUpdate from "./pages/PostUpdate";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/register" 
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/guest" 
                element={
                  <PublicRoute>
                    <GuestView />
                  </PublicRoute>
                } 
              />

              {/* Protected Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/entrepreneur/dashboard"
                element={
                  <ProtectedRoute requiredRole="entrepreneur">
                    <EntrepreneurDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/investor/dashboard"
                element={
                  <ProtectedRoute requiredRole="investor">
                    <InvestorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-campaign"
                element={
                  <ProtectedRoute requiredRole="entrepreneur">
                    <CreateCampaign />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/project/:id"
                element={
                  <ProtectedRoute>
                    <ProjectDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/post-update/:projectId"
                element={
                  <ProtectedRoute requiredRole="entrepreneur">
                    <PostUpdate />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payment/:projectId"
                element={
                  <ProtectedRoute requiredRole="investor">
                    <Payment />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/projects"
                element={
                  <ProtectedRoute>
                    <ProjectList />
                  </ProtectedRoute>
                }
              />

              {/* Fallback Route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
