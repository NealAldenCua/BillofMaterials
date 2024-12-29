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

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  };
  
  const headerStyle = {
    backgroundColor: "#f4f4f4",
    textAlign: "left",
    padding: "10px",
    borderBottom: "2px solid #ddd",
    textAlign: "center"
  };
  
  const cellStyle = {
    padding: "10px",
    border: "1px solid #ddd",
    textAlign: "center",
  };

  const formStyle = {
    display: "flex",
    flexDirection: "row", // Changes from column to row for landscape
    flexWrap: "wrap", // Allow wrapping to the next line
    gap: "15px",
    maxwidth: "100%", // Use full width for landscape
    margin: "20px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  };

  const inputStyle = {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "14px",
    width: "170px", // Limiting width for landscape
  };

  const selectStyle = {
    ...inputStyle,
  };

  const buttonStyle = {
    padding: "10px",
    margin: "5px",
    backgroundColor: "#42a5f5",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
    maxwidth: "100%", // Make the button full width in the landscape layout
  };

  
  return (
  <>
  <h1 style={{margin: "50px"}}>Bill of Materials</h1>

    <form style={formStyle}>
      <select
        name="kindOfMaterial"
        value={newProject.kindOfMaterial}
        onChange={handleChange}
        style={selectStyle}
      >
        <option value="" disabled selected>
          Select Kind of Material
        </option>
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
        style={inputStyle}
      />
      <input
        type="text"
        name="itemDescription"
        placeholder="Item Description"
        value={newProject.itemDescription}
        onChange={handleChange}
        style={inputStyle}
      />
      <input
        type="text"
        name="sizeAndTension"
        placeholder="Size and Tension"
        value={newProject.sizeAndTension}
        onChange={handleChange}
        style={inputStyle}
      />
      <input
        type="number"
        name="quantity"
        placeholder="Quantity"
        value={newProject.quantity}
        onChange={handleChange}
        style={inputStyle}
      />
      <input
        type="text"
        name="unitOfMeasurement"
        placeholder="Unit of Measurement"
        value={newProject.unitOfMeasurement}
        onChange={handleChange}
        style={inputStyle}
      />
      <select
        name="inventoryNote"
        value={newProject.inventoryNote}
        onChange={handleChange}
        style={selectStyle}
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
        style={inputStyle}
      />
      <input
        type="number"
        name="laborUnitCost"
        placeholder="Labor Unit Cost"
        value={newProject.laborUnitCost}
        onChange={handleChange}
        style={inputStyle}
      />
      <button style={buttonStyle}
        type="button"
        onClick={addOrUpdateProject}
        // style={hover ? buttonHoverStyle : buttonStyle}
        // onMouseEnter={() => setHover(true)}
        // onMouseLeave={() => setHover(false)}
      >
        {editingProjectId ? "Update Project" : "Add Project"}
      </button>
    </form>
    
  <table style={tableStyle}>
      <thead>
        <tr>
          <th style={headerStyle}>Kind of Material</th>
          <th style={headerStyle}>Item Number</th>
          <th style={headerStyle}>Item Description</th>
          <th style={headerStyle}>Size & Tension</th>
          <th style={headerStyle}>Quantity</th>
          <th style={headerStyle}>Unit of Measurement</th>
          <th style={headerStyle}>Inventory Note</th>
          <th style={headerStyle}>Material Unit Cost</th>
          <th style={headerStyle}>Labor Unit Cost</th>
          <th style={headerStyle}>Material Total Cost</th>
          <th style={headerStyle}>Labor Total Cost</th>
          <th style={headerStyle}>Total Amount</th>
          <th style={headerStyle}>Actions</th>  
        </tr>
      </thead>
      <tbody>
        {projects.map((project, index) => (
          <tr
            key={project.id}
            style={{
              backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff",
            }}
          >
            <td style={cellStyle}>{project.kindOfMaterial}</td>
            <td style={cellStyle}>{project.itemNumber}</td>
            <td style={cellStyle}>{project.itemDescription}</td>
            <td style={cellStyle}>{project.sizeAndTension}</td>
            <td style={cellStyle}>{project.quantity}</td>
            <td style={cellStyle}>{project.unitOfMeasurement}</td>
            <td style={cellStyle}>{project.inventoryNote}</td>
            <td style={cellStyle}>{project.materialUnitCost}</td>
            <td style={cellStyle}>{project.laborUnitCost}</td>
            <td style={cellStyle}>{project.materialTotalCost}</td>
            <td style={cellStyle}>{project.laborTotalCost}</td>
            <td style={cellStyle}>{project.totalAmountOfKindOfMaterial}</td>
            <td style={cellStyle}>
              <button style={buttonStyle} onClick={() => handleEdit(project)}>
                Edit
              </button>
              <button style={buttonStyle} onClick={() => handleDelete(project.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </>
  ); 
};

export default BOM;