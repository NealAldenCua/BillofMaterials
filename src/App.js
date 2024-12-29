import React from "react";
import { Route, Routes } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import BOM from "./pages/BOM";

const App = () => (
  <>
    <Navbar />

    <Routes>
      <Route path='/' element={<Dashboard />}></Route>
      <Route path='Dashboard' element={<Dashboard />}></Route>
      <Route path='Bill of Materials' element={<BOM />}></Route>
    </Routes>
  </>
);

export default App;