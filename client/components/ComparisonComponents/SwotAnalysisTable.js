import React from "react";
import { Table } from "react-bootstrap";

const SwotTable = () => {
  return (
    <>
    <h4>SWOT Analysis</h4>
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
            <td>Strengths</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>Weaknesses</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>Opportunities</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>Threats</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </Table>
    </>
  );
};

export default SwotTable;
