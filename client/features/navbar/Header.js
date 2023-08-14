import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Routes, Route, Link } from "react-router-dom";
import Home from "../Home/Home";
import { me } from "../../app/store";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { LinkContainer } from "react-router-bootstrap";

const Header = () => {
  const isLoggedIn = useSelector((state) => !!state.auth.me.id);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(me());
  }, []);

  const loggedInHeader = (
    <Navbar expand="lg" bg="light" data-bs-theme="light">
        <Container>
          <img
            src="/mag_glass_logo.png"
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt="magnifying glass logo"
          />
          <Navbar.Brand href="/">Compare.ly</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto"></Nav>
            <Nav>
              <Nav.Link href="/compare">Compare</Nav.Link>
              <NavDropdown title="More" id="basic-nav-dropdown">
                <NavDropdown.Item href="/login">Account</NavDropdown.Item>
                <NavDropdown.Item disabled href="#chatbot">Chatbot</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
  );

  const guestHeader = (
    <Navbar expand="lg" bg="light" data-bs-theme="light">
        <Container>
          <img
            src="/mag_glass_logo.png"
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt="magnifying glass logo"
          />
          <Navbar.Brand href="/">Compare.ly</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto"></Nav>
            <Nav>
              <Nav.Link href="/compare">Compare</Nav.Link>
              <Nav.Link href="/signup">Sign Up</Nav.Link>
              <Nav.Link disabled href="#chatbot">Chatbot</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
  )

  return<>
     {isLoggedIn ? loggedInHeader : guestHeader}
    </>
};

export default Header;
