import React from "react";
import { Table } from "react-bootstrap";

const ProductProfileTable = () => {
  return (
    <>
    <h4 id="product-profile">Product Profile</h4>
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
            <td>The Product</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>Positioning</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>Key Product Features</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </Table>
    </>
  );
};

export default ProductProfileTable;
