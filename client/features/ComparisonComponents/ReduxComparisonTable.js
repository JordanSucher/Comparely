import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import TypingEffectCell from "./TypingEffectCell";

const ReduxComparisonComparisonTable = ({
  title,
  companies,
  companyNames,
  doTypingEffect,
  swots,
}) => {
  console.log("recieved swots:", swots);
  console.log("received companies:", companies);

  

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

export default ReduxComparisonTable;
