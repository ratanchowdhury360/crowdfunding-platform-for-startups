import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useAuth } from "../context/AuthContext";

const Payment = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [project, setProject] = useState(null);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projectDoc = await getDoc(doc(db, "projects", projectId));
        if (projectDoc.exists()) {
          setProject(projectDoc.data());
        } else {
          setError("Project not found");
        }
      } catch (err) {
        console.error("Error fetching project:", err);
        setError("Error fetching project details");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!currentUser) {
      setError("Please login to invest");
      return;
    }

    const investmentAmount = Number(amount);
    if (isNaN(investmentAmount) || investmentAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    try {
      setSubmitting(true);

      // Create investment record
      const investmentData = {
        projectId,
        projectTitle: project.title,
        investorId: currentUser.uid,
        investorEmail: currentUser.email,
        amount: investmentAmount,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "investments"), investmentData);

      // Update project raised amount
      const projectRef = doc(db, "projects", projectId);
      await updateDoc(projectRef, {
        raised: project.raised + investmentAmount,
        investors: [...(project.investors || []), currentUser.uid],
      });

      navigate(`/project/${projectId}`);
    } catch (err) {
      console.error("Error processing investment:", err);
      setError("Error processing investment: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (error && !project) {
    return (
      <div className="min-h-screen bg-background text-white p-4">
        <div className="max-w-md mx-auto">
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
    <div className="min-h-screen bg-background text-white p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-8">Invest in {project.title}</h1>

        {error && (
          <div className="bg-red-500 text-white p-4 rounded mb-6">
            {error}
          </div>
        )}

        <div className="bg-white/5 p-6 rounded-lg mb-6">
          <div className="mb-4">
            <h2 className="text-lg font-medium mb-2">Project Details</h2>
            <p className="text-gray-400">{project.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-400">Funding Goal</p>
              <p className="text-lg font-medium">${project.goal.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Raised So Far</p>
              <p className="text-lg font-medium">${project.raised.toLocaleString()}</p>
            </div>
          </div>

          <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
            <div
              className="bg-accent h-2 rounded-full"
              style={{
                width: `${Math.min((project.raised / project.goal) * 100, 100)}%`,
              }}
            ></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Investment Amount (USD)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              step="1"
              className="w-full px-4 py-2 rounded bg-white/5 border border-accent/20 focus:outline-none focus:border-accent"
              required
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-accent text-black py-3 rounded hover:bg-accent/90 disabled:opacity-50"
            >
              {submitting ? "Processing..." : "Invest Now"}
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

export default Payment; 