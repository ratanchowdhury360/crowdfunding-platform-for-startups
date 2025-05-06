import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";

const GuestView = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApprovedProjects = async () => {
      try {
        const projectsRef = collection(db, "projects");
        const q = query(projectsRef, where("approved", "==", true));
        const snapshot = await getDocs(q);
        const projectList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProjects(projectList);
        setError(null);
      } catch (err) {
        setError("Error fetching projects: " + err.message);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedProjects();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-white p-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-white p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Featured Projects</h1>
          <div className="flex gap-4">
            <Link to="/login" className="bg-accent text-black px-6 py-2 rounded hover:bg-accent/90">
              Login
            </Link>
            <Link to="/register" className="border border-accent text-accent px-6 py-2 rounded hover:bg-accent/10">
              Register
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-500 text-white p-4 rounded mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <div key={project.id} className="bg-white/5 rounded-lg overflow-hidden border border-accent/20">
              {project.imageUrl && (
                <img 
                  src={project.imageUrl} 
                  alt={project.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p className="text-gray-300 mb-4 line-clamp-2">{project.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-accent">Goal: ${project.goal}</span>
                  <span className="text-sm text-gray-400">By {project.createdBy}</span>
                </div>
                <Link 
                  to={`/project/${project.id}`}
                  className="block w-full bg-accent text-black text-center py-2 rounded hover:bg-accent/90"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No projects available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuestView;
