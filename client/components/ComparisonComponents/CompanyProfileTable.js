import React from "react";
import { Table } from "react-bootstrap";

const CompanyProfileTable = () => {
  return(
    <>
    <h4>Company Profile</h4>
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
          <td>Founded</td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>Company Size</td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>Market Share</td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>Revenue</td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      </tbody>
    </Table>
    </>
  )
}

export default CompanyProfileTable;
