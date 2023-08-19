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
  const [doTypingEffect, setDoTypingEffect] = useState(false);

  const [companyIds, setCompanyIds] = useState([]);
  const [companyNames, setCompanyNames] = useState({});
  const [swotsData, setSwotsData] = useState({});

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let { comparisonId } = useParams();


  const getData = async () => {
    try {
      console.log("comparisonId", comparisonId);
      const { data } = await axios.get(`/api/comparisons/${comparisonId}`);
      if (data.text) setData(JSON.parse(data.text));
    } catch (error) {
      console.log(`Error fetching data:`, error);
    }
  };

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
        getData();
      }
    };

    evtSource.onerror = function (err) {
      console.error("EventSource failed:", err);
      evtSource.close();
    };

    getData();
  }, []);
  console.log(data);

  useEffect(() => {
    // Create an async function
    const fetchCompanyNames = async () => {
      // Create an array to store all promises
      const promises = data.features.map(async (obj) => {
        if (!companyNames[obj.companyId]) {
          const { data } = await axios.get("/api/companies/" + obj.companyId);
          return { id: obj.companyId, name: data.name };
        }
        return null; // If the company name already exists, return null
      });

      // Resolve all promises
      const results = await Promise.all(promises);

      // Create a new object based on the previous companyNames and the fetched results
      const newCompanyNames = { ...companyNames };
      results.forEach((result) => {
        if (result) {
          // Check if the result isn't null
          newCompanyNames[result.id] = toTitleCase(result.name);
        }
      });

      // Update the state
      setCompanyNames(newCompanyNames);
      console.log(newCompanyNames)
    };

    // Call the async function
    if (data.features) {
      fetchCompanyNames();
    }

  }, [data.features]);

  // SEPERATE CALL FOR SWOT DATA
  // useEffect(() => {
  //   const fetchSwotsData = async () => {
  //     try{
  //       const { data } = await axios.get(`/api/comparisons/${comparisonId}`);
  //       if(data.swots){
  //         setSwotsData(data.swots);
  //       }
  //     } catch(error) {
  //       console.log('Error fetching swots data:', error);
  //     }
  //   }
  //   fetchSwotsData();
  // }, [comparisonId]);

  // console.log("COMPARISON SwotsData:", swotsData)
  function toTitleCase(str) {
    if (str) {
    return str.split(' ').map(function (word) {
      return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
  }
  }

  const title = Object.values(companyNames).join(" v ");
  console.log(title)


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
        <h1 className="text-center">
          {title}
        </h1>
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
        <ComparisonTable
          title={"Company Profile"}
          companies={data.features}
          companyNames={companyNames}
          doTypingEffect={doTypingEffect
          }
        />
        <ComparisonTable
          title={"Swot Analysis"}
          swots={data.swots}
          companyNames={companyNames}
          doTypingEffect={doTypingEffect}
        />
      </Row>
    </Container>
  );
};

export default Comparison;
