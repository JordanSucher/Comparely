import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import Header from "./Header";

const Root = () => {
  return (
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
