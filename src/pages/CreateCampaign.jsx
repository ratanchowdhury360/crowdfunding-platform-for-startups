import React, { useState } from "react";
import { collection, addDoc, serverTimestamp, doc, setDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const CreateCampaign = () => {
  const navigate = useNavigate();
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
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!auth.currentUser) {
      setError("Please login to create a project");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // First, ensure the user document exists
      const userRef = doc(db, "users", auth.currentUser.uid);
      await setDoc(userRef, {
        email: auth.currentUser.email,
        role: "entrepreneur",
        createdAt: serverTimestamp(),
      }, { merge: true });

      // Then create the project
      const projectData = {
        ...formData,
        goal: Number(formData.goal),
        createdBy: auth.currentUser.email,
        creatorId: auth.currentUser.uid,
        approved: false,
        createdAt: serverTimestamp(),
        status: "pending",
        raised: 0,
        investors: [],
        updates: [],
      };

      const docRef = await addDoc(collection(db, "projects"), projectData);
      console.log("Project created with ID:", docRef.id);
      navigate("/entrepreneur/dashboard");
    } catch (err) {
      console.error("Error creating project:", err);
      setError("Error creating project: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-white p-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Create New Campaign</h1>

        {error && (
          <div className="bg-red-500 text-white p-4 rounded mb-6">
            {error}
          </div>
        )}

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
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-white/5 border border-accent/20 focus:outline-none focus:border-accent"
              required
            >
              <option className="bg-slate-500" value="technology">Technology</option>
              <option className="bg-slate-500" value="healthcare">Healthcare</option>
              <option className="bg-slate-500" value="education">Education</option>
              <option className="bg-slate-500" value="sustainability">Sustainability</option>
              <option className="bg-slate-500" value="finance">Finance</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 rounded bg-white/5 border border-accent/20 focus:outline-none focus:border-accent"
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
              min="0"
              className="w-full px-4 py-2 rounded bg-white/5 border border-accent/20 focus:outline-none focus:border-accent"
              required
            />
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
            <label className="block text-sm font-medium mb-2">Video URL (Optional)</label>
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
              rows={4}
              className="w-full px-4 py-2 rounded bg-white/5 border border-accent/20 focus:outline-none focus:border-accent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Team Information</label>
            <textarea
              name="teamInfo"
              value={formData.teamInfo}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 rounded bg-white/5 border border-accent/20 focus:outline-none focus:border-accent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Risks and Challenges</label>
            <textarea
              name="risks"
              value={formData.risks}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 rounded bg-white/5 border border-accent/20 focus:outline-none focus:border-accent"
              required
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-accent text-black py-3 rounded hover:bg-accent/90 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Campaign"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/entrepreneur/dashboard")}
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

export default CreateCampaign;