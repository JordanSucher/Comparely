import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import axios from "axios";

const ComparisonTable = ({ title, companies }) => {
  const [showColumns, setShowColumns] = useState({});
  const [headers, setHeaders] = useState([]);
  const [companyIds, setCompanyIds] = useState([]);
  const [companyNames, setCompanyNames] = useState({});

  const toggleColumns = (companyName) => {
    setShowColumns((prevShowColumns) => ({
      ...prevShowColumns,
      [companyName]: !prevShowColumns[companyName],
    }));
  };

  useEffect(() => {
    const initialShowColumns = {};
    const tempCompanyIds = [];

    if (companies && companies[0] && companies[0].features) {
      setHeaders(companies[0].features.map((feature) => feature.key));
    }

    if (companies) {
      companies.forEach((company) => {
        initialShowColumns[company.companyId] = true;
        tempCompanyIds.push(company.companyId);
      });
    }

    setShowColumns(initialShowColumns);
    setCompanyIds(tempCompanyIds);
  }, [companies]);

  useEffect(() => {
    // Create an async function
    const fetchCompanyNames = async () => {
        // Create an array to store all promises
        const promises = companyIds.map(async companyId => {
            if (!companyNames[companyId]) {
                const { data } = await axios.get("/api/companies/" + companyId);
                return { id: companyId, name: data.name };
            }
            return null;  // If the company name already exists, return null
        });

        // Resolve all promises
        const results = await Promise.all(promises);

        // Create a new object based on the previous companyNames and the fetched results
        const newCompanyNames = { ...companyNames };
        results.forEach(result => {
            if (result) { // Check if the result isn't null
                newCompanyNames[result.id] = result.name;
            }
        });

        // Update the state
        setCompanyNames(newCompanyNames);
    };

    // Call the async function
    fetchCompanyNames();

}, [companyIds]);

function toTitleCase(str) {
  if (str) {
  return str.split(' ').map(function (word) {
    return (word.charAt(0).toUpperCase() + word.slice(1));
  }).join(' ');
}
}

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
                    <span>{toTitleCase(companyNames[company.companyId])}</span>
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
