import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useAuth } from "../context/AuthContext";

const PostUpdate = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { currentUser, userRole } = useAuth();
  const [project, setProject] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goal: "",
    category: "technology",
    imageUrl: "",
    videoUrl: "",
    businessPlan: "",
    teamInfo: "",
    risks: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        if (!currentUser || userRole !== "entrepreneur") {
          navigate("/login");
          return;
        }

        const projectDoc = await getDoc(doc(db, "projects", projectId));
        if (!projectDoc.exists()) {
          setError("Project not found");
          return;
        }

        const projectData = projectDoc.data();
        if (projectData.createdBy !== currentUser.email) {
          setError("You can only update your own projects");
          return;
        }

        setProject(projectData);
        // Initialize form with existing project data
        setFormData({
          title: projectData.title || "",
          description: projectData.description || "",
          goal: projectData.goal || "",
          category: projectData.category || "technology",
          imageUrl: projectData.imageUrl || "",
          videoUrl: projectData.videoUrl || "",
          businessPlan: projectData.businessPlan || "",
          teamInfo: projectData.teamInfo || "",
          risks: projectData.risks || "",
        });
        setError(null);
      } catch (err) {
        console.error("Error fetching project:", err);
        setError("Error fetching project details");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId, currentUser, userRole, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      setSubmitting(true);

      // Update project document
      await updateDoc(doc(db, "projects", projectId), {
        ...formData,
        goal: Number(formData.goal),
        updatedAt: serverTimestamp(),
        lastUpdatedBy: currentUser.email,
      });

      // Navigate back to project page
      navigate(`/project/${projectId}`);
    } catch (err) {
      console.error("Error updating project:", err);
      setError("Error updating project: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-white p-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-white p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-500 text-white p-4 rounded mb-6">
            {error}
          </div>
          <button
            onClick={() => navigate(-1)}
            className="w-full bg-accent text-black py-3 rounded hover:bg-accent/90"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-white p-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Update Project Details</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Project Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-white/5 border border-accent/20 focus:outline-none focus:border-accent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-white/5 border border-accent/20 focus:outline-none focus:border-accent"
              rows="4"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Funding Goal (USD)</label>
            <input
              type="number"
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-white/5 border border-accent/20 focus:outline-none focus:border-accent"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-white/5 border border-accent/20 focus:outline-none focus:border-accent"
              required
            >
              <option value="technology">Technology</option>
              <option value="healthcare">Healthcare</option>
              <option value="education">Education</option>
              <option value="sustainability">Sustainability</option>
              <option value="finance">Finance</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Image URL</label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-white/5 border border-accent/20 focus:outline-none focus:border-accent"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Video URL</label>
            <input
              type="url"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-white/5 border border-accent/20 focus:outline-none focus:border-accent"
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Business Plan</label>
            <textarea
              name="businessPlan"
              value={formData.businessPlan}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-white/5 border border-accent/20 focus:outline-none focus:border-accent"
              rows="4"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Team Information</label>
            <textarea
              name="teamInfo"
              value={formData.teamInfo}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-white/5 border border-accent/20 focus:outline-none focus:border-accent"
              rows="3"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Risks and Challenges</label>
            <textarea
              name="risks"
              value={formData.risks}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-white/5 border border-accent/20 focus:outline-none focus:border-accent"
              rows="3"
              required
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-accent text-black py-3 rounded hover:bg-accent/90 disabled:opacity-50"
            >
              {submitting ? "Updating Project..." : "Update Project"}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 bg-gray-700 text-white py-3 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostUpdate;
