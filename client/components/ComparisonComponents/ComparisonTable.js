import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";

const ComparisonTable = ({ title, headers, companies }) => {
  const [showColumns, setShowColumns] = useState({});

  const toggleColumns = (companyName) => {
    setShowColumns((prevShowColumns) => ({
      ...prevShowColumns,
      [companyName]: !prevShowColumns[companyName],
    }));
  };

  useEffect(() => {
    const initialShowColumns = {};
    companies.forEach((company) => {
      initialShowColumns[company.name] = true;
    });
    setShowColumns(initialShowColumns);
  }, [companies]);

  return (
    <>
      <h4>{title}</h4>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th></th>
            {companies.map((company) => (
              <th key={company.id}>
                <div className="d-flex justify-content-between align-items-center">
                  <span>{company.name}</span>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => toggleColumns(company.name)}
                  >
                    Hide
                  </Button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {headers.map((header, columnIndex) => (
            <tr key={header}>
              <td>{header}</td>
              {companies.map((company) => (
                <td
                  key={`${company.id}-${header}`}
                  hidden={!showColumns[company.name]}
                >
                  {company[Object.keys(company)[columnIndex + 2]]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default ComparisonTable;
