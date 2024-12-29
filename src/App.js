import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import BOM from "./components/BOM";

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/bom/:id" element={<BOM />} />
    </Routes>
  </Router>
);

export default App;
