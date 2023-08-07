import React from "react";
import { Table } from "react-bootstrap";

const TakeawaysTable = () => {
  return (
    <>
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
            <td>Your Company Strengths</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>Competitor #1's Strengths</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </Table>
    </>
  );
};

export default TakeawaysTable;
