
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const ProjectList = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const q = query(collection(db, "projects"), where("approved", "==", true));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProjects(data);
    };
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-background text-white p-6">
      <h2 className="text-3xl font-bold mb-6">Discover Projects</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {projects.map((project) => (
          <div key={project.id} className="bg-white text-black p-4 rounded shadow">
            <h3 className="text-xl font-bold">{project.title}</h3>
            <p>{project.description}</p>
            <p className="text-sm text-gray-600">By: {project.createdBy}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectList;
