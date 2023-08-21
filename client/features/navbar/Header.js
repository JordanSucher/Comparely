import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Home from "../Home/Home";
import { me, logout } from "../../app/store";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { LinkContainer } from "react-router-bootstrap";
import { Dropdown } from "react-bootstrap";

const Header = () => {
  const isLoggedIn = useSelector((state) => !!state.auth.me.id);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutAndRedirectHome = () => {
    dispatch(logout());
    navigate("/");
  };

  useEffect(() => {
    dispatch(me());
  }, []);

  const loggedInHeader = (
    <Navbar expand="lg" >
      <Container>
      <i class="fa-solid fa-magnifying-glass"></i>
        <Navbar.Brand href="/">Compare.ly</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto"></Nav>
          <Nav>
            <Nav.Link href="/compare">Compare</Nav.Link>
            <Nav.Link href="/account">Account</Nav.Link>
            <Nav.Link onClick={logoutAndRedirectHome}>
                  Log Out
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );

  const guestHeader = (
    <Navbar expand="lg" >
      <Container>
      <i class="fa-solid fa-magnifying-glass"></i>
        <Navbar.Brand href="/">Compare.ly</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto"></Nav>
          <Nav>
            <Nav.Link href="/compare">Compare</Nav.Link>
            <Nav.Link href="/create-account">Login</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );

  return <>{isLoggedIn ? loggedInHeader : guestHeader}</>;
};

export default Header;
