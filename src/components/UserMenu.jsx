import React from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const UserMenu = () => {
  const user = auth.currentUser;
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  return (
    <div className="absolute top-4 right-4 bg-white text-black rounded shadow p-4 text-sm">
      <p><strong>ID:</strong> {user?.uid}</p>
      <p><strong>Email:</strong> {user?.email}</p>
      <button onClick={handleLogout} className="mt-2 btn btn-sm bg-accent text-black">Logout</button>
    </div>
  );
};

export default UserMenu;
