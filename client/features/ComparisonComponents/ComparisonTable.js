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
  console.log("received companies:", companies);

  const [showColumns, setShowColumns] = useState({});
  const [headers, setHeaders] = useState([]);
  const [companyIds, setCompanyIds] = useState([]);
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

  // //SWOT HEADERS
  useEffect(() => {
    const initialShowColumns = {};
    const tempCompanyIds = [];
    // Check if swots and swots[0].swot exist before proceeding
    if (swots && swots[0] && swots[0].swot) {
      // Set headers based on keys in the first swot object
      setHeaders(swots[0].swot.map((key) => key.key));
    }

    if (swots) {
      // Initialize showColumns and companyIds arrays
      swots.forEach((swot) => {
        initialShowColumns[swot.companyId] = true;
        tempCompanyIds.push(swot.companyId);
      });

      // Set showColumns and companyIds state
      setShowColumns(initialShowColumns);
      setCompanyIds(tempCompanyIds);

      if (swots) {
        // Calculate the width for columns
        let calculatedWidth = `${100 / (swots.length || 1)}%`;
        setCalculatedWidth(calculatedWidth);
        console.log(calculatedWidth);
      }
    }
  }, [swots]);

//
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
            swots.map((swotItem) => (
              <th key={swotItem.companyId} style={{ width: calculatedWidth }}>
                <div className="d-flex justify-content-between align-items-center">
                  <span>{companyNames[swotItem.companyId]}</span>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => toggleColumns(swotItem.companyId)}
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
            swots &&
            headers.map((header) => (
              <tr key={header}>
                <td>{header}</td>
                {swots.map((swotItem) => (
                  <TypingEffectCell
                    key={`${swots.companyId}-${header}`}
                    hidden={!showColumns[swots.companyId]}
                    doTypingEffect={doTypingEffect}
                    fullText={getFirstTwoSentences(
                      swotItem.swot.find((item) => item.key === header)?.value
                    )}
                  />
                ))}
              </tr>
            ))}
        </>
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

  function tableRender(x) {
    if (x !== undefined) {
      if (title === "Swot Analysis") {
        return swotTable;
      } else if (title === "Company Profile") {
        return companyProfile;
      }
    }
    console.log("NO TABLE RENDER");
    return null;
  }

  return (
    <>
      <div id="company-profile">
        <h4>{title}</h4>
        {tableRender(true)}
      </div>
    </>
  );
};

export default ComparisonTable;
