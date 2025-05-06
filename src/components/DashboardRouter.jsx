// src/components/DashboardRouter.jsx
import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

// ✅ Corrected paths to pages
import EntrepreneurDashboard from "../pages/EntrepreneurDashboard";
import InvestorDashboard from "../pages/InvestorDashboard";
import GuestView from "../pages/GuestView";

const DashboardRouter = () => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      const user = auth.currentUser;

      if (!user) {
        setRole("guest");
        setLoading(false);
        return;
      }

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setRole(userData.role || "guest");
      } else {
        setRole("guest");
      }

      setLoading(false);
    };

    fetchRole();
  }, []);

  if (loading) return <div className="text-white p-6">Loading...</div>;

  switch (role) {
    case "entrepreneur":
      return <EntrepreneurDashboard />;
    case "investor":
      return <InvestorDashboard />;
    default:
      return <GuestView />;
  }
};

export default DashboardRouter;
