import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../firebase";
import { Link } from "react-router-dom";

const InvestorDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (!auth.currentUser) {
          setError("Please login to access the dashboard");
          return;
        }

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

    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || project.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
          <h1 className="text-3xl font-bold">Investor Dashboard</h1>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search projects..."
              className="px-4 py-2 rounded bg-white/5 border border-accent/20 focus:outline-none focus:border-accent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="px-4 py-2 rounded bg-white/5 border border-accent/20 focus:outline-none focus:border-accent"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option className="bg-slate-500" value="all">All Categories</option>
              <option className="bg-slate-500" value="technology">Technology</option>
              <option className="bg-slate-500"value="healthcare">Healthcare</option>
              <option className="bg-slate-500"value="education">Education</option>
              <option className="bg-slate-500"value="sustainability">Sustainability</option>
              <option className="bg-slate-500"value="finance">Finance</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="bg-red-500 text-white p-4 rounded mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
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
                <div className="space-y-2">
                  <Link 
                    to={`/project/${project.id}`}
                    className="block w-full bg-accent text-black text-center py-2 rounded hover:bg-accent/90"
                  >
                    View Details
                  </Link>
                  <Link 
                    to={`/payment/${project.id}`}
                    className="block w-full bg-green-500 text-white text-center py-2 rounded hover:bg-green-600"
                  >
                    Invest Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              {searchTerm || selectedCategory !== "all" 
                ? "No projects match your search criteria."
                : "No projects available at the moment."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestorDashboard;
