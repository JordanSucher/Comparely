import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import axios from "axios";
import TypingEffectCell from "./TypingEffectCell";

const ComparisonTable = ({
  title,
  companies,
  companyNames,
  doTypingEffect,
  swots,
}) => {
  console.log("recieved swots:", swots);

  const [showColumns, setShowColumns] = useState({});
  const [headers, setHeaders] = useState([]);
  const [companyIds, setCompanyIds] = useState([]);
  // const [companyNames, setCompanyNames] = useState({});
  const [calculatedWidth, setCalculatedWidth] = useState(0);

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

    if (companies) {
      let calculatedWidth = `${100 / (companies.length || 1)}%`;
      setCalculatedWidth(calculatedWidth);
      console.log(calculatedWidth);
    }
  }, [companies]);

  const getFirstTwoSentences = (text) => {
    // Split by sentences and grab first 2
    // also, strip the source citing
    if (text) {
      let strippedText = text.replace(/\[\d+\]/g, "");
      const sentences = strippedText.match(/[^.!?]+[.!?]/g);
      return sentences?.slice(0, 2).join(" ") || "";
    }

    // Take the first three
  };

  let swotTable = (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th></th>
          {swots &&
            swots.map((swot) => (
              <th key={swot.companyId} style={{ width: calculatedWidth }}>
                <div className="d-flex justify-content-between align-items-center">
                  <span>{companyNames[swot.companyId]}</span>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => toggleColumns(swot.companyId)}
                  >
                    Hide
                  </Button>
                </div>
              </th>
            ))}
        </tr>
      </thead>

      <tbody>
        {headers &&
          swots &&
          swots.length > 0 &&
          headers.map((header) => (
            <tr key={header}>
              <td>{header}</td>
              {swots.map((swotItem) => {
                const swotValue = swotItem.swot.find(
                  (item) => item.key === header
                );
                return (
                  <TypingEffectCell
                    key={`${swotItem.companyId}-${header}`}
                    hidden={!showColumns[swotItem.companyId]}
                    doTypingEffect={doTypingEffect}
                    fullText={getFirstTwoSentences(swotValue?.value)}
                  />
                );
              })}
            </tr>
          ))}
      </tbody>
    </Table>
  );

  let companyProfile = (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th></th>
          {companies &&
            companies.map((company) => (
              <th key={company.companyId} style={{ width: calculatedWidth }}>
                <div className="d-flex justify-content-between align-items-center">
                  <span>{companyNames[company.companyId]}</span>
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
        <>
          {headers &&
            headers.map((header) => (
              <tr key={header}>
                <td>{header}</td>
                {companies &&
                  companies.map((company) => (
                    <TypingEffectCell
                      key={`${company.companyId}-${header}`}
                      hidden={!showColumns[company.companyId]}
                      doTypingEffect={doTypingEffect}
                      fullText={getFirstTwoSentences(
                        company.features.find(
                          (feature) => feature.key === header
                        )?.value
                      )}
                    />
                  ))}
              </tr>
            ))}
        </>
      </tbody>
    </Table>
  );

  console.log("COMPARISON TABLE SWOTS:", swots);
  console.log("swotTable:", swotTable);

  return (
    <>
      <div id="company-profile">
        <h4>{title}</h4>
        {title === "Company Profile" ? companyProfile : null}
        {title === "Swot Analysis" ? swotTable : null}
      </div>
    </>
  );
};

export default ComparisonTable;
