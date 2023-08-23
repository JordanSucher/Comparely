import React, { useState } from "react";
import { Navbar, Stack, Nav, Col, Row, Container } from "react-bootstrap";

const TableOfContents = ({handleClose}) => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });

    }
  };

  const handleSectionClick = (sectionId) => {
    scrollToSection(sectionId);
    handleClose();
  };

  return (
    <>
      <Nav className="d-flex flex-column">
        <Nav.Link
          className="my-4 text-decoration-none text-dark"
          onClick={() => handleSectionClick("company-profile")}
        >
          Company Profile
        </Nav.Link>
        <Nav.Link
          className="my-4 text-decoration-none text-dark"
          onClick={() => handleSectionClick("swot-analysis")}
        >
          SWOT Analysis
        </Nav.Link>
        <Nav.Link
          className="my-4 text-decoration-none text-dark"
          onClick={() => handleSectionClick("product-profile")}
        >
          Product Profile
        </Nav.Link>
        <Nav.Link
          className="my-4 text-decoration-none text-dark"
          onClick={() => handleSectionClick("market-approach")}
        >
          Market Approach
        </Nav.Link>
        <Nav.Link
          className="my-4 text-decoration-none text-dark"
          onClick={() => handleSectionClick("takeaways")}
        >
          Takeaways
        </Nav.Link>
      </Nav>
    </>
  );
};

export default TableOfContents;
