import React from "react";
import { Routes, Route, Link } from "react-router-dom";
// import Home from "./components/Home";
import Header from "./components/Header";
import Comparison from "./components/ComparisonComponents/Comparison";
import Homeski from "./components/Homeski";
import Loading from "./components/Loading";
import CreateProfile from "./components/CreateProfile";

const Root = () => {
  return (
    <>
    {/* <Header />
      <Routes>
        <Route path="/" element={<Homeski />} />
        <Route path="/compare" element={<Comparison />} />
      </Routes> */}
      <CreateProfile />
    </>
  );
};

export default Root;
