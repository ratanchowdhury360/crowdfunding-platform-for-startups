import React from "react";

const PostUpdate = () => {
  return (
    <div className="min-h-screen bg-background text-white p-6 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Post Project Update</h2>
      <form className="space-y-4">
        <input type="text" placeholder="Update Title" className="input input-bordered w-full" />
        <textarea placeholder="Write your update..." className="textarea textarea-bordered w-full" rows="6"></textarea>
        <button className="bg-accent text-black px-6 py-2 rounded font-semibold">Submit Update</button>
      </form>
    </div>
  );
};

export default PostUpdate;
