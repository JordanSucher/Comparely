import React from "react";
import { Navbar, Stack, Nav, Col, Row } from "react-bootstrap";

const TableOfContents = () => {
  return (
    <>
        <Nav className="flex-column align-middle">
          <Nav.Link>Company Profile</Nav.Link>
          <Nav.Link>SWOT Analysis</Nav.Link>
          <Nav.Link>Product Profile</Nav.Link>
          <Nav.Link>Market Approach</Nav.Link>
          <Nav.Link>Takeaways</Nav.Link>
        </Nav>
    </>
  );
};

export default TableOfContents;
