import React from "react";
import { Routes, Route, Link } from "react-router-dom";
// import Home from "./components/Home";
import Header from "./components/Header";
import Comparison from "./components/ComparisonComponents/Comparison";
import Home from "./components/Home";
import Loading from "./components/Loading";
import CreateAccountForm from "./components/Account/CreateAccountForm";
import AccountDetails from "./components/Account/AccountDetails";
import Login from "./components/Account/Login";
import AuthForm from "./components/Account/AuthForm";

const Root = () => {
  return (
    <>
      <Header />
      <AuthForm />
      {/* <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/comparisons" element={<Comparison />} />
      </Routes> */}
    </>
  );
};

export default Root;
