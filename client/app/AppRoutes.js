import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Route, Routes, useParams } from "react-router-dom";
import AuthForm from "../features/Account/AuthForm";
import { me } from "./store";
import { Container } from "react-bootstrap";
import Home from "../features/Home/Home";
import AccountDetails from "../features/Account/AccountDetails";
import Comparison from "../features/ComparisonComponents/Comparison";

const AppRoutes = () => {
  const isLoggedIn = useSelector((state) => !!state.auth.me.id);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(me());
  }, []);

  const loggedInRoutes = (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/compare/:companyId" element={<Comparison />} />
      <Route path="/account" element={<AccountDetails/>} />
    </Routes>
  );

  const guestRoutes = (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/compare/:companyId" element={<Comparison />} />
      <Route path="/create-account" element={<AuthForm />} />
    </Routes>
  );

  return<>
  <Container>{isLoggedIn ? loggedInRoutes : guestRoutes}</Container>
  </>;
};
export default AppRoutes;
