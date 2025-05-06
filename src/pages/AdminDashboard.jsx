import React, { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { db, auth } from "../firebase";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [approvedProjects, setApprovedProjects] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("pending"); // "pending" or "approved"

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (!auth.currentUser || auth.currentUser.email !== "admin@startfund.com") {
          setError("Please login with admin credentials");
          return;
        }

        // Fetch pending projects
        const pendingProjectsRef = collection(db, "projects");
        const pendingQuery = query(pendingProjectsRef, where("approved", "==", false));
        const pendingSnapshot = await getDocs(pendingQuery);
        const pendingList = pendingSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProjects(pendingList);

        // Fetch approved projects
        const approvedQuery = query(pendingProjectsRef, where("approved", "==", true));
        const approvedSnapshot = await getDocs(approvedQuery);
        const approvedList = approvedSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setApprovedProjects(approvedList);

        setError(null);
      } catch (err) {
        setError("Error fetching projects: " + err.message);
        setProjects([]);
        setApprovedProjects([]);
      }
    };
    fetchProjects();
  }, []);

  const handleApprove = async (id) => {
    try {
      if (!auth.currentUser || auth.currentUser.email !== "admin@startfund.com") {
        setError("Only admin can approve projects");
        return;
      }
      await updateDoc(doc(db, "projects", id), { approved: true });
      setProjects(projects.filter(p => p.id !== id));
      setError(null);
    } catch (err) {
      setError("Error approving project: " + err.message);
    }
  };

  const handleReject = async (id) => {
    try {
      if (!auth.currentUser || auth.currentUser.email !== "admin@startfund.com") {
        setError("Only admin can reject projects");
        return;
      }
      await deleteDoc(doc(db, "projects", id));
      setProjects(projects.filter(p => p.id !== id));
      setError(null);
    } catch (err) {
      setError("Error rejecting project: " + err.message);
    }
  };

  const handleBookmark = async (id) => {
    try {
      await updateDoc(doc(db, "projects", id), { bookmarked: true });
      setApprovedProjects(approvedProjects.map(p => 
        p.id === id ? { ...p, bookmarked: true } : p
      ));
    } catch (err) {
      setError("Error bookmarking project: " + err.message);
    }
  };

  const renderProjectCard = (project, isPending = false) => (
    <div key={project.id} className="border border-accent p-4 rounded mb-4 bg-white/5">
      <h3 className="text-xl font-semibold">{project.title}</h3>
      <p className="text-gray-300">{project.description}</p>
      <p><strong>Created by:</strong> {project.createdBy}</p>
      <p><strong>Goal:</strong> ${project.goal}</p>
      <p><strong>Status:</strong> {project.status}</p>
      <div className="flex gap-2 mt-2">
        {isPending ? (
          <>
            <button onClick={() => handleApprove(project.id)} className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600">Approve</button>
            <button onClick={() => handleReject(project.id)} className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600">Reject</button>
          </>
        ) : (
          <>
            <button onClick={() => handleBookmark(project.id)} className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">
              {project.bookmarked ? "Bookmarked" : "Bookmark"}
            </button>
            <button onClick={() => handleReject(project.id)} className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600">Delete</button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-4 bg-background text-white min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      
      {error && (
        <div className="bg-red-500 text-white p-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex gap-4 mb-6">
        <button 
          onClick={() => setActiveTab("pending")}
          className={`px-4 py-2 rounded ${activeTab === "pending" ? "bg-accent text-black" : "bg-gray-700"}`}
        >
          Pending Projects
        </button>
        <button 
          onClick={() => setActiveTab("approved")}
          className={`px-4 py-2 rounded ${activeTab === "approved" ? "bg-accent text-black" : "bg-gray-700"}`}
        >
          Browse Projects
        </button>
      </div>

      {activeTab === "pending" ? (
        <>
          <h3 className="text-xl font-semibold mb-4">Pending Projects</h3>
          {projects.length === 0 ? (
            <p className="text-gray-400">No pending projects to review.</p>
          ) : (
            projects.map(project => renderProjectCard(project, true))
          )}
        </>
      ) : (
        <>
          <h3 className="text-xl font-semibold mb-4">Approved Projects</h3>
          {approvedProjects.length === 0 ? (
            <p className="text-gray-400">No approved projects found.</p>
          ) : (
            approvedProjects.map(project => renderProjectCard(project))
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
