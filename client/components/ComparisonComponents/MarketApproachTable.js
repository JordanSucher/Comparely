import React from "react";
import { Table } from "react-bootstrap";

const MarketApproachTable = () => {
  return(
    <>
    <h4 id="market-approach">Market Approach</h4>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th></th>
            <th>Your Company</th>
            <th>Competitor #1</th>
            <th>Competitor #2 </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Product Pricing</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>Distribution Channels</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>Marketing Channels</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </Table>
    </>
  )
}

export default MarketApproachTable;
