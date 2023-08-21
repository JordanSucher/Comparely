import React, { useEffect, useState } from "react";
import TableOfContents from "./TableOfContents";
import { Container, Row, Offcanvas, Button } from "react-bootstrap";
import ComparisonTable from "./ComparisonTable";
import { CaretRight } from "react-bootstrap-icons";
import { useParams } from "react-router-dom";
import { fetchCompanyNames, fetchData } from "./comparisonSlice";
import { useDispatch, useSelector } from "react-redux";
import ReduxComparisonTable from "./ReduxComparisonTable";

const ReduxComparison = () => {
  const dispatch = useDispatch();

  const [show, setShow] = useState(false);
  const [doTypingEffect, setDoTypingEffect] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let { comparisonId } = useParams();


  const data = useSelector((state) => state.comparison.text);
  const swots = useSelector((state) => state.comparison.swots);
  const articles = useSelector((state) => state.comparison.articles);
  const companyProfiles = useSelector((state) => state.comparison.companyProfiles);
  const companyNames = useSelector((state) => state.comparison.companyNames);

  useEffect(() => {
    dispatch(fetchData(comparisonId))
  },[dispatch, comparisonId]);
  console.log("Initial State", data);

  useEffect(() => {
    if (data && swots.length > 0) {
      dispatch(fetchCompanyNames(companyProfiles));
    }
  }, [dispatch, data, companyProfiles]);

  console.log("Company names", companyNames);

  //DATA STREAMING
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
        fetchData();
      }
    };

    evtSource.onerror = function (err) {
      console.error("EventSource failed:", err);
      evtSource.close();
    };

    fetchData();
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
        <ReduxComparisonTable
          title="Company Profile"
          tableData={companyProfiles}
          companyNames={companyNames}
          doTypingEffect={doTypingEffect}
        />
      </Row>
    </Container>
  );
};

export default ReduxComparison;
