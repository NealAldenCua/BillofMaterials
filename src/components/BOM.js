import React, { useEffect, useState } from "react";
import { database } from "../firebase";
import { ref, onValue, update } from "firebase/database";
import { useParams, useNavigate } from "react-router-dom";

const BOM = () => {
  const { id } = useParams(); // Get project ID from the URL
  const navigate = useNavigate();
  const [project, setProject] = useState(null);

  useEffect(() => {
    const projectRef = ref(database, `projects/${id}`);
    onValue(projectRef, (snapshot) => {
      setProject(snapshot.val());
    });
  }, [id]);

  const handleUpdate = () => {
    if (!project) return;

    const projectRef = ref(database, `projects/${id}`);
    update(projectRef, project).then(() => {
      alert("Project updated!");
      navigate("/");
    });
  };

  if (!project) return <div>Loading...</div>;

  return (
    <div>
      <h1>BOM Details</h1>
      <form>
        <label>Kind of Material:</label>
        <input
          type="text"
          value={project.kindOfMaterial}
          onChange={(e) =>
            setProject((prev) => ({ ...prev, kindOfMaterial: e.target.value }))
          }
        />
        {/* Add inputs for other fields as needed */}
        <button type="button" onClick={handleUpdate}>
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default BOM;
