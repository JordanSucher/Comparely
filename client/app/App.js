import React from "react";
import { Routes, Route, Link } from "react-router-dom";
// import Home from "./components/Home";
import Header from "../features/navbar/Header";
import Comparison from "../features/ComparisonComponents/Comparison";
import Home from "../features/Home/Home";
import Loading from "../features/Loading";
import CreateAccountForm from "../features/Account/CreateAccountForm";
import AccountDetails from "../features/Account/AccountDetails";
import Login from "../features/Account/Login";
import AuthForm from "../features/Account/AuthForm";
import AppRoutes from "./AppRoutes";

const App = () => {
  return (
    <>
      <Header />
      <AppRoutes/>
      {/* <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/comparisons" element={<Comparison />} />
      </Routes> */}
    </>
  );
};

export default App;
