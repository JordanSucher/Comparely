import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home";

const Root = () => {
  return (
    <div>
      <nav>
          <h1>Compare.ly</h1>
          <p>Easily keep track of your competitors.</p>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
};

export default Root;
