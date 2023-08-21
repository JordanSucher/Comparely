import React, { useEffect, useState } from "react";
import TableOfContents from "./TableOfContents";
import { Container, Row, Offcanvas, Button } from "react-bootstrap";
import ComparisonTable from "./ComparisonTable";
import { CaretRight } from "react-bootstrap-icons";
import { useParams } from "react-router-dom";
import { fetchData } from "./comparisonSlice";
import { useDispatch, useSelector } from "react-redux";
import ReduxComparisonTable from "./ReduxComparisonTable";

const ReduxComparison = () => {
  const dispatch = useDispatch();
  //This is tentative functions to access DB
  const [show, setShow] = useState(false);
  const [doTypingEffect, setDoTypingEffect] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let { comparisonId } = useParams();

  useEffect(() => {
    dispatch(fetchData(comparisonId))
  },[])

  const data = useSelector((state) => state.comparison.text);
  console.log("received data:", data)


  useEffect(() => {
    // Initialize SSE connection
    const evtSource = new EventSource(
      `/api/comparisons/${comparisonId}/progress`
    );

    evtSource.onmessage = function (event) {
      const sseData = JSON.parse(event.data);
      console.log(sseData);
      if (sseData.progress) {
        // Log the progress & refresh data
        console.log(sseData.progress);
        setDoTypingEffect(true);
        dispatch(fetchData(comparisonId));
      }
    };

    evtSource.onerror = function (err) {
      console.error("EventSource failed:", err);
      evtSource.close();
    };

  }, []);




  return (
    <Container fluid>
      <Offcanvas id="contents-slider" show={show} onHide={handleClose}>
        <Offcanvas.Header className="mt-5" closeButton>
          <Offcanvas.Title>Table Sections</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <TableOfContents handleClose={handleClose} />
        </Offcanvas.Body>
      </Offcanvas>

      <Row className="my-5">
        <h1 className="text-center">YOUR COMPANY VS COMPETITORS</h1>
      </Row>
      <Button
        className="border-0"
        id="expand-button"
        variant="outline-dark"
        size="md"
        onClick={handleShow}
        onMouseOver={handleShow}
      >
        <CaretRight size={20} />
      </Button>

      <Row className="mx-5">
      </Row>
    </Container>
  );
};

export default ReduxComparison;
