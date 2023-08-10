import React from "react";
import { Container, Table } from "react-bootstrap";

const ComparisonTable = ({ prop }) => {
  return (
    <>
      <h4 className="text-center">{prop.companyProfile}</h4>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th></th>
            {companies.map((company) => (
              <th>{company.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{prop.founded}</td>
            {companies.founded.map((company) => (
              <td>{company.foundedinfo}</td>
            ))}
          </tr>
          <tr>
            <td>{prop.companySize}</td>
            {companies.companySize.map((company) => (
              <td>{company.companySize}</td>
            ))}
          </tr>
        </tbody>
      </Table>
    </>
  );
};
