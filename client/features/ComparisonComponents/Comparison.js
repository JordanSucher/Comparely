import React, { useContext, useEffect, useState } from "react";
import TableOfContents from "./TableOfContents";
import SwotAnalysisTable from "./SwotAnalysisTable";
import { Container, Row, Col, Offcanvas, Button } from "react-bootstrap";
import axios from "axios";
import ComparisonTable from "./ComparisonTable";
import { CaretRight } from "react-bootstrap-icons";
import { useParams } from "react-router-dom";

const Comparison = () => {
  //This is tentative functions to access DB
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let { comparisonId } = useParams();

  const getData = async () => {
    try {
      console.log("comparisonId", comparisonId);
      const { data } = await axios.get(`/api/comparisons/${comparisonId}`);
      setData(JSON.parse(data.text));
      console.log(data);
    } catch (error) {
      console.log(`Error fetching data:`, error);
    }
  };

  useEffect(() => {
    // Initialize SSE connection
    const evtSource = new EventSource(`/api/comparisons/${comparisonId}/progress`);
      
    evtSource.onmessage = function(event) {
      const sseData = JSON.parse(event.data);
      console.log(sseData);
      if (sseData.progress) {
        // Log the progress & refresh data
        console.log(sseData.progress);
        getData();
      }
    };
  
    evtSource.onerror = function(err) {
      console.error("EventSource failed:", err);
      evtSource.close();
    };

    getData();
  }, []);

  console.log(data);
  return (
    <Container fluid>
      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header className="mt-5" closeButton>
          <Offcanvas.Title>Table Sections</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <TableOfContents />
        </Offcanvas.Body>
      </Offcanvas>

      <Row className="my-5">
        <h1 className="text-center">Your Company VS. The World</h1>
      </Row>
      <Row className="sticky-top d-inline-flex">
        <Button
          className="border-0"
          variant="outline-dark"
          size="sm"
          onClick={handleShow}
        >
          <CaretRight size={20} />
        </Button>
      </Row>

      <Row className="mx-5">
        <ComparisonTable title="Company Profile" companies={data.features} />
        {/*<SwotAnalysisTable
          title="Swot Analysis"
          companies={data.swots}
        /> */}
      </Row>
    </Container>
  );
};

export default Comparison;
