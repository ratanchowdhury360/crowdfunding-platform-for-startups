import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-background text-white flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-4xl font-bold mb-4">Welcome to StartupFund</h1>
      <p className="mb-8 text-lg max-w-md">
        A crowdfunding platform for startups. Log in or explore projects as a guest.
      </p>
      <div className="flex gap-4">
        <Link to="/login" className="bg-accent text-black font-semibold px-6 py-3 rounded hover:opacity-90">
          Login
        </Link>
        <Link to="/guest" className="border border-accent text-accent px-6 py-3 rounded hover:bg-accent hover:text-black transition">
          Continue Without Login
        </Link>
      </div>
    </div>
  );
};

export default Home;
