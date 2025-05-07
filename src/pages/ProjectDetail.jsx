import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, userRole } = useAuth();
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [showInvestModal, setShowInvestModal] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projectDoc = await getDoc(doc(db, "projects", id));
        if (!projectDoc.exists()) {
          setError("Project not found");
          return;
        }
        setProject({ id: projectDoc.id, ...projectDoc.data() });
        setError(null);
      } catch (err) {
        setError("Error fetching project: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleInvest = async () => {
    if (!auth.currentUser) {
      navigate("/login");
      return;
    }

    const amount = Number(investmentAmount);
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid investment amount");
      return;
    }

    try {
      setError(null);
      await updateDoc(doc(db, "projects", id), {
        raised: project.raised + amount,
        investors: arrayUnion({
          email: auth.currentUser.email,
          amount: amount,
          date: new Date().toISOString(),
        }),
      });

      setProject(prev => ({
        ...prev,
        raised: prev.raised + amount,
        investors: [...prev.investors, {
          email: auth.currentUser.email,
          amount: amount,
          date: new Date().toISOString(),
        }],
      }));

      setShowInvestModal(false);
      setInvestmentAmount("");
    } catch (err) {
      setError("Error processing investment: " + err.message);
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
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-500 text-white p-4 rounded mb-6">
            {error}
          </div>
          <Link to="/" className="text-accent hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!project) return null;

  const progress = (project.raised / project.goal) * 100;

  return (
    <div className="min-h-screen bg-background text-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link 
            to={
              currentUser
                ? userRole === "admin"
                  ? "/admin/dashboard"
                  : userRole === "entrepreneur"
                  ? "/entrepreneur/dashboard"
                  : userRole === "investor"
                  ? "/investor/dashboard"
                  : "/"
                : "/"
            } 
            className="text-accent hover:underline"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {project.imageUrl && (
          <img 
            src={project.imageUrl} 
            alt={project.title}
            className="w-full h-96 object-cover rounded-lg mb-8"
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
            <p className="text-gray-300 mb-6">{project.description}</p>

            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Business Plan</h2>
                <p className="text-gray-300">{project.businessPlan}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Team Information</h2>
                <p className="text-gray-300">{project.teamInfo}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Risks and Challenges</h2>
                <p className="text-gray-300">{project.risks}</p>
              </div>

              {project.videoUrl && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">Project Video</h2>
                  <div className="aspect-w-16 aspect-h-9">
                    <iframe
                      src={project.videoUrl}
                      title="Project Video"
                      className="w-full h-full rounded-lg"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white/5 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Campaign Details</h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400">Goal</p>
                  <p className="text-2xl font-bold">${project.goal.toLocaleString()}</p>
                </div>

                <div>
                  <p className="text-gray-400">Raised</p>
                  <p className="text-2xl font-bold">${project.raised.toLocaleString()}</p>
                </div>

                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-accent h-2 rounded-full" 
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>

                <div>
                  <p className="text-gray-400">Category</p>
                  <p className="capitalize">{project.category}</p>
                </div>

                <div>
                  <p className="text-gray-400">Created by</p>
                  <p>{project.createdBy}</p>
                </div>

                {auth.currentUser && auth.currentUser.email !== project.createdBy && (
                  <button
                    onClick={() => setShowInvestModal(true)}
                    className="w-full bg-accent text-black py-3 rounded hover:bg-accent/90"
                  >
                    Invest Now
                  </button>
                )}
              </div>
            </div>

            {project.investors && project.investors.length > 0 && (
              <div className="bg-white/5 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Recent Investors</h2>
                <div className="space-y-2">
                  {project.investors.slice(-5).map((investor, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-300">{investor.email}</span>
                      <span className="text-accent">${investor.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {showInvestModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-background p-6 rounded-lg max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">Make an Investment</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Investment Amount (USD)</label>
                <input
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  className="w-full px-4 py-2 rounded bg-white/5 border border-accent/20 focus:outline-none focus:border-accent"
                  min="1"
                  placeholder="Enter amount"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleInvest}
                  className="flex-1 bg-accent text-black py-2 rounded hover:bg-accent/90"
                >
                  Confirm Investment
                </button>
                <button
                  onClick={() => setShowInvestModal(false)}
                  className="flex-1 bg-gray-700 text-white py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;
