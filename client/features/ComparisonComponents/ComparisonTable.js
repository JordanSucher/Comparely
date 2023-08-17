import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";

const ComparisonTable = ({ title, companies }) => {
  const [showColumns, setShowColumns] = useState({});
  const [headers, setHeaders] = useState([]);

  const toggleColumns = (companyName) => {
    setShowColumns((prevShowColumns) => ({
      ...prevShowColumns,
      [companyName]: !prevShowColumns[companyName],
    }));
  };

  useEffect(() => {
    const initialShowColumns = {};

    if (companies && companies[0] && companies[0].features) {
      setHeaders(companies[0].features.map((feature) => feature.key));
    }

    if (companies) {
      companies.forEach((company) => {
        initialShowColumns[company.companyId] = true;
      });
    }

    setShowColumns(initialShowColumns);
  }, [companies]);

  return (
    <>
      <div id="company-profile">
        <h4>{title}</h4>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th></th>
              {companies && companies.map((company) => (
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
            {headers && headers.map((header) => (
              <tr key={header}>
                <td>{header}</td>
                {companies && companies.map((company) => (
                  <td
                    key={`${company.companyId}-${header}`}
                    hidden={!showColumns[company.companyId]}
                  >
                    {
                      company.features.find((feature) => feature.key === header)
                        ?.value
                    }
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

export default ComparisonTable;
