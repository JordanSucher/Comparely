import React from "react";
import { Navbar, Stack, Nav, Col, Row, Container } from "react-bootstrap";

const TableOfContents = () => {
  


  return (
    <>
    <Container  fluid className="h-100 px-0">
        <Nav className="my-5 position-sticky top-0">
          <Nav.Link className="my-3 text-decoration-none text-dark">Company Profile</Nav.Link>
          <Nav.Link className="my-3 text-decoration-none text-dark">SWOT Analysis</Nav.Link>
          <Nav.Link className="my-3 text-decoration-none text-dark">Product Profile</Nav.Link>
          <Nav.Link className="my-3 text-decoration-none text-dark">Market Approach</Nav.Link>
          <Nav.Link className="my-3 text-decoration-none text-dark">Takeaways</Nav.Link>
        </Nav>
      </Container>
    </>
  );
};

export default TableOfContents;
