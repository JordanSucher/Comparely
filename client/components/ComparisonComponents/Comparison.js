import React from "react";
import TableOfContents from "./TableOfContents";
import CompanyProfileTable from "./CompanyProfileTable";
import SwotTable from "./SwotAnalysisTable";
import ProductProfileTable from "./ProductProfileTable";
import MarketApproachTable from "./MarketApproachTable";
import { Container, Row, Col } from "react-bootstrap";
import TakeawaysTable from "./TakeawaysTable";

const Comparison = () => {
  return (
    <Container>
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
