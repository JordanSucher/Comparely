import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import Header from "./Header";

const Root = () => {
  return (
    // <div>
    //   <nav>
    //     <div className="p-3 text-center border-bottom bg-primary text-white">
    //       <h1>Compare.ly</h1>
    //       <p>Easily keep track of your competitors.</p>
    //     </div>
    //   </nav>
    <>
      <Header />
      <Home />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );
};

export default Root;
