import React, { useState, useEffect } from "react";
import { database } from "../firebase";
import { ref, onValue, push, update, remove } from "firebase/database";

const BOM = () => {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({
    kindOfMaterial: "",
    itemNumber: "",
    itemDescription: "",
    sizeAndTension: "",
    quantity: 0,
    unitOfMeasurement: "",
    inventoryNote: "With Stock",
    materialUnitCost: 0,
    laborUnitCost: 0,
  });
  const [editingProjectId, setEditingProjectId] = useState(null);

  useEffect(() => {
    const projectsRef = ref(database, "projects");
    onValue(projectsRef, (snapshot) => {
      const data = snapshot.val();
      const projectsArray = data
        ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
        : [];
      setProjects(projectsArray);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProject((prev) => ({
      ...prev,
      [name]: name === "quantity" || name.endsWith("Cost") ? +value : value,
    }));
  };

  const calculateCosts = (project) => {
    const materialTotalCost = project.quantity * project.materialUnitCost;
    const laborTotalCost = project.quantity * project.laborUnitCost;
    const totalAmountOfKindOfMaterial = materialTotalCost + laborTotalCost;

    return { materialTotalCost, laborTotalCost, totalAmountOfKindOfMaterial };
  };

  const addOrUpdateProject = () => {
    if (!newProject.kindOfMaterial || !newProject.itemDescription) {
      alert("Kind of Material and Item Description are required.");
      return;
    }

    const { materialTotalCost, laborTotalCost, totalAmountOfKindOfMaterial } =
      calculateCosts(newProject);

    const projectData = {
      ...newProject,
      materialTotalCost,
      laborTotalCost,
      totalAmountOfKindOfMaterial,
    };

    if (editingProjectId) {
      const projectRef = ref(database, `projects/${editingProjectId}`);
      update(projectRef, projectData);
    } else {
      const projectsRef = ref(database, "projects");
      push(projectsRef, projectData);
    }

    setNewProject({
      kindOfMaterial: "",
      itemNumber: "",
      itemDescription: "",
      sizeAndTension: "",
      quantity: 0,
      unitOfMeasurement: "",
      inventoryNote: "With Stock",
      materialUnitCost: 0,
      laborUnitCost: 0,
    });
    setEditingProjectId(null);
  };

  const handleEdit = (project) => {
    setNewProject(project);
    setEditingProjectId(project.id);
  };

  const handleDelete = (id) => {
    const projectRef = ref(database, `projects/${id}`);
    remove(projectRef);
  };

  return (
    <div>
      <h1>Bill of Materials</h1>
      <form>
        <select
          name="kindOfMaterial"
          value={newProject.kindOfMaterial}
          onChange={handleChange}
        >
          <option value="" disabled selected>Select Kind of Material</option>
          <option value="Metal Fabrication/Structural">Metal Fabrication/Structural</option>
          <option value="Accessories">Accessories</option>
          <option value="Mechanical Conversion-1">Mechanical Conversion-1</option>
          <option value="Painting Materials">Painting Materials</option>
          <option value="Consumables">Consumables</option>
          <option value="Fabrication / Painting Works">Fabrication / Painting Works</option>
          <option value="Bending Works & Others">Bending Works & Others</option>
        </select>
        <input
          type="text"
          name="itemNumber"
          placeholder="Item Number"
          value={newProject.itemNumber}
          onChange={handleChange}
        />
        <input
          type="text"
          name="itemDescription"
          placeholder="Item Description"
          value={newProject.itemDescription}
          onChange={handleChange}
        />
        <input
          type="text"
          name="sizeAndTension"
          placeholder="Size and Tension"
          value={newProject.sizeAndTension}
          onChange={handleChange}
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={newProject.quantity}
          onChange={handleChange}
        />
        <input
          type="text"
          name="unitOfMeasurement"
          placeholder="Unit of Measurement"
          value={newProject.unitOfMeasurement}
          onChange={handleChange}
        />
        <select
          name="inventoryNote"
          value={newProject.inventoryNote}
          onChange={handleChange}
        >
          <option value="With Stock">With Stock</option>
          <option value="Not in Stock">Not in Stock</option>
        </select>
        <input
          type="number"
          name="materialUnitCost"
          placeholder="Material Unit Cost"
          value={newProject.materialUnitCost}
          onChange={handleChange}
        />
        <input
          type="number"
          name="laborUnitCost"
          placeholder="Labor Unit Cost"
          value={newProject.laborUnitCost}
          onChange={handleChange}
        />
        <button type="button" onClick={addOrUpdateProject}>
          {editingProjectId ? "Update Project" : "Add Project"}
        </button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Kind of Material</th>
            <th>Item Number</th>
            <th>Item Description</th>
            <th>Size and Tension</th>
            <th>Quantity</th>
            <th>Unit of Measurement</th>
            <th>Inventory Note</th>
            <th>Material Unit Cost</th>
            <th>Labor Unit Cost</th>
            <th>Material Total Cost</th>
            <th>Labor Total Cost</th>
            <th>Total Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => {
            const {
              materialTotalCost,
              laborTotalCost,
              totalAmountOfKindOfMaterial,
            } = calculateCosts(project);
            return (
              <tr key={project.id}>
                <td>{project.kindOfMaterial}</td>
                <td>{project.itemNumber}</td>
                <td>{project.itemDescription}</td>
                <td>{project.sizeAndTension}</td>
                <td>{project.quantity}</td>
                <td>{project.unitOfMeasurement}</td>
                <td>{project.inventoryNote}</td>
                <td>{project.materialUnitCost}</td>
                <td>{project.laborUnitCost}</td>
                <td>{materialTotalCost}</td>
                <td>{laborTotalCost}</td>
                <td>{totalAmountOfKindOfMaterial}</td>
                <td>
                  <button onClick={() => handleEdit(project)}>Edit</button>
                  <button onClick={() => handleDelete(project.id)}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default BOM;