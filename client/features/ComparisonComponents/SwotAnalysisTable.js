import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";

const SwotAnalysisTable = ({ title, companies }) => {
  const [showColumns, setShowColumns] = useState({});

  const toggleColumns = (companyId) => {
    setShowColumns((prevShowColumns) => ({
      ...prevShowColumns,
      [companyId]: !prevShowColumns[companyId],
    }));
  };

  useEffect(() => {
    const initialShowColumns = {};
    companies.forEach((company) => {
      initialShowColumns[company.companyId] = true;
    });
    setShowColumns(initialShowColumns);
  }, [companies]);

  const headers = ["Strengths", "Weaknesses", "Opportunities", "Threats"];

  return (
    <>
    <div id="swot-analysis">
      <h4>{title}</h4>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th></th>
            {companies.map((company) => (
              <th key={company.companyId}>
                <div className="d-flex justify-content-between align-items-center">
                  <span>{company.companyId}</span>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => toggleColumns(company.companyId)}
                  >
                    Hide
                  </Button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {headers.map((header) => (
            <tr key={header}>
              <td>{header}</td>
              {companies.map((company) => (
                <td
                  key={`${company.companyId}-${header}`}
                  hidden={!showColumns[company.companyId]}
                >
                  {company[header.toLowerCase()]} {/* Assuming your SWOT object has properties like 'strengths', 'weaknesses', etc. */}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
      </div>
    </>
  );
};

export default SwotAnalysisTable;
