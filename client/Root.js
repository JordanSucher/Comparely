import React from "react";
import { Routes, Route, Link } from "react-router-dom";
// import Home from "./components/Home";
import Header from "./components/Header";
import Comparison from "./components/ComparisonComponents/Comparison";
import Home from "./components/Home";
import Loading from "./components/Loading";
import CreateAccountForm from "./components/Account/CreateAccountForm";

const Root = () => {
  return (
    <>
      <Header />
      <Comparison />
      {/* <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/comparisons" element={<Comparison />} />
      </Routes> */}
    </>
  );
};

export default Root;
