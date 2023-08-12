import React, { useState } from "react";
import { Navbar, Stack, Nav, Col, Row, Container } from "react-bootstrap";

const TableOfContents = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSectionClick = (sectionId) => {
    scrollToSection(sectionId);
  };

  return (
    <>
      <Container fluid className="h-100 px-0">
        <Nav className="my-5 position-sticky top-0">
          <Nav.Link
            className="my-3 text-decoration-none text-dark"
            onClick={() => handleSectionClick("company-profile")}
          >
            Company Profile
          </Nav.Link>
          <Nav.Link
            className="my-3 text-decoration-none text-dark"
            onClick={() => handleSectionClick("swot-analysis")}
          >
            SWOT Analysis
          </Nav.Link>
          <Nav.Link
            className="my-3 text-decoration-none text-dark"
            onClick={() => handleSectionClick("product-profile")}
          >
            Product Profile
          </Nav.Link>
          <Nav.Link
            className="my-3 text-decoration-none text-dark"
            onClick={() => handleSectionClick("market-approach")}
          >
            Market Approach
          </Nav.Link>
          <Nav.Link
             className="my-3 text-decoration-none text-dark"
            onClick={() => handleSectionClick("takeaways")}
          >
            Takeaways
          </Nav.Link>
        </Nav>
      </Container>
    </>
  );
};

export default TableOfContents;
