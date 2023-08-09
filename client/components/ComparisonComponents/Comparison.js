import React, {useContext, useEffect, useState} from "react";
import TableOfContents from "./TableOfContents";
import CompanyProfileTable from "./CompanyProfileTable";
import SwotTable from "./SwotAnalysisTable";
import ProductProfileTable from "./ProductProfileTable";
import MarketApproachTable from "./MarketApproachTable";
import TakeawaysTable from "./TakeawaysTable";
import { Container, Row, Col } from "react-bootstrap";
import axios from "axios";

const Comparison = () => {
  const [data, setData] = useState([]);

  const getData = async () => {
    const { data } = await axios.get('/api/comparisons');
    setData(data);
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <Container fluid>
      <Row>
        <Col xs={3} className="sticky-left">
          <TableOfContents />
        </Col>
        <Col>
          <CompanyProfileTable />
          <SwotTable swot={data.swot} />
          <ProductProfileTable />
          <MarketApproachTable />
          <TakeawaysTable />
        </Col>
      </Row>
    </Container>
  );
};

export default Comparison;
