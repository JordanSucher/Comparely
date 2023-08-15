import React, { useContext, useEffect, useState } from "react";
import TableOfContents from "./TableOfContents";
import CompanyProfileTable from "./CompanyProfileTable";
import SwotAnalysisTable from "./SwotAnalysisTable";
import ProductProfileTable from "./ProductProfileTable";
import MarketApproachTable from "./MarketApproachTable";
import TakeawaysTable from "./TakeawaysTable";
import { Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import ComparisonTable from "./ComparisonTable";

const Comparison = () => {
  // const title = "Company Profile";
  // const headers = ["Founded", "Company Size", "Market Share", "Revenue"];
  // const companies = [
  //   { id: 1, name: "Splooge", founded: "2000", companySize: "Large", marketShare: "10%", revenue: "$1M" },
  //   { id: 2, name: "Jabooki", founded: "1995", companySize: "Medium", marketShare: "8%", revenue: "$800K" },
  //   { id: 3, name: "NesQuickski", founded: "2010", companySize: "Small", marketShare: "5%", revenue: "$500K" }
  // ];


  //This is tentative functions to access DB
  const [data, setData] = useState([]);

  // const getData = async () => {
  //   const { data } = await axios.get('/api/comparisons');
  //   setData(data);
  // }

  // useEffect(() => {
  //   fetch('./data.json')
  //     .then(response => response.json())
  //     .then(jsonData => {
  //       console.log(jsonData)
  //       setData(jsonData); // Store the fetched JSON data in state
  //     })
  //     .catch(error => {
  //       console.error('Error loading JSON:', error);
  //     });
  // }, []);

  return (
    <Container fluid>
      <Row>
        <Col xs={2}>
          <TableOfContents />
        </Col>
        <Col className="my-5 me-5">
          <Row>
            <h1 className="text-center mb-5">Your Company VS. The World</h1>
          </Row>
          <ComparisonTable title="Company Profile" companies={companyData.features}/>
          <SwotAnalysisTable title="Swot Analysis" companies={companyData.swots}/>
        </Col>
      </Row>
    </Container>
  );
};

export default Comparison;
