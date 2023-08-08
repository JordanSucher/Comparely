import React from "react";
import TableOfContents from "./TableOfContents";
import CompanyProfileTable from "./CompanyProfileTable";
import SwotTable from "./SwotAnalysisTable";
import ProductProfileTable from "./ProductProfileTable";
import MarketApproachTable from "./MarketApproachTable";
import TakeawaysTable from "./TakeawaysTable";
import { Container, Row, Col } from "react-bootstrap";

const Comparison = () => {
  return (
    <Container fluid>
      <Row>
        <Col xs={3} className="sticky-left">
          <TableOfContents />
        </Col>
        <Col>
          <CompanyProfileTable />
          <SwotTable />
          <ProductProfileTable />
          <MarketApproachTable />
          <TakeawaysTable />
        </Col>
      </Row>
    </Container>
  );
};

export default Comparison;
