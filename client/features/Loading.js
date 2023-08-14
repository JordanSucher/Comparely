import React from "react";
import { Container, Spinner } from "react-bootstrap";

const Loading = () => {
  return (
    <>
      <Container className="d-flex flex-column justify-content-center align-items-center text-center vh-100">
        <h4>We're actively comparing your competitors.
          <br></br>
          We'll send an email once we've finished.
        </h4>
        <Spinner animation="border" variant="dark" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <h4>Take a break, we've got it from here.</h4>
      </Container>
    </>
  );
};

export default Loading;
