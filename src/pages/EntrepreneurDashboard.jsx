import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../firebase";
import { Link } from "react-router-dom";

const EntrepreneurDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [myProjects, setMyProjects] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("browse"); // "browse" or "my-projects"
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

        // Fetch all approved projects
        const projectsRef = collection(db, "projects");
        const approvedQuery = query(projectsRef, where("approved", "==", true));
        const approvedSnapshot = await getDocs(approvedQuery);
        const approvedList = approvedSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProjects(approvedList);

        // Fetch entrepreneur's projects
        const myProjectsQuery = query(
          projectsRef,
          where("createdBy", "==", auth.currentUser.email)
        );
        const myProjectsSnapshot = await getDocs(myProjectsQuery);
        const myProjectsList = myProjectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMyProjects(myProjectsList);

        setError(null);
      } catch (err) {
        setError("Error fetching projects: " + err.message);
        setProjects([]);
        setMyProjects([]);
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

  const filteredMyProjects = myProjects.filter(project => {
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

  const renderProjectCard = (project) => (
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
        <div className="flex gap-2">
          <Link 
            to={`/project/${project.id}`}
            className="flex-1 bg-accent text-black text-center py-2 rounded hover:bg-accent/90"
          >
            View Details
          </Link>
          {project.createdBy === auth.currentUser?.email && (
            <Link 
              to={`/post-update/${project.id}`}
              className="flex-1 bg-blue-500 text-white text-center py-2 rounded hover:bg-blue-600"
            >
              Post Update
            </Link>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-white p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Entrepreneur Dashboard</h1>
        </div>

        {error && (
          <div className="bg-red-500 text-white p-4 rounded mb-6">
            {error}
          </div>
        )}

        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => setActiveTab("browse")}
            className={`px-4 py-2 rounded ${activeTab === "browse" ? "bg-accent text-black" : "bg-gray-700"}`}
          >
            Browse Projects
          </button>
          <button 
            onClick={() => setActiveTab("my-projects")}
            className={`px-4 py-2 rounded ${activeTab === "my-projects" ? "bg-accent text-black" : "bg-gray-700"}`}
          >
            My Projects
          </button>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Search projects..."
            className="flex-1 px-4 py-2 rounded bg-white/5 border border-accent/20 focus:outline-none focus:border-accent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="px-4 py-2 rounded bg-white/5 border border-accent/20 focus:outline-none focus:border-accent"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="technology">Technology</option>
            <option value="healthcare">Healthcare</option>
            <option value="education">Education</option>
            <option value="sustainability">Sustainability</option>
            <option value="finance">Finance</option>
          </select>
        </div>

        {activeTab === "browse" ? (
          <>
            <h2 className="text-2xl font-semibold mb-4">Browse Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map(project => renderProjectCard(project))}
            </div>
            {filteredProjects.length === 0 && (
              <p className="text-gray-400 text-center py-8">
                {searchTerm || selectedCategory !== "all" 
                  ? "No projects match your search criteria."
                  : "No projects available at the moment."}
              </p>
            )}
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold mb-4">My Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMyProjects.map(project => renderProjectCard(project))}
            </div>
            {filteredMyProjects.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">
                  {searchTerm || selectedCategory !== "all" 
                    ? "No projects match your search criteria."
                    : "You haven't created any projects yet."}
                </p>
                {!searchTerm && selectedCategory === "all" && (
                  <Link 
                    to="/create"
                    className="inline-block bg-accent text-black px-6 py-2 rounded hover:bg-accent/90"
                  >
                    Create Your First Project
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EntrepreneurDashboard;
