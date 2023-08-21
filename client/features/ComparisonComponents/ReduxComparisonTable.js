import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import TypingEffectCell from "./TypingEffectCell";

const ReduxComparisonTable = ({
  title,
  companies,
  companyNames
}) => {
  console.log("received companies:", companies);
  console.log("recieved companyNames:", companyNames);


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
        <Table striped bordered hover >
          <thead>
            <tr>
              <th></th>
              {companies.map((company) => (
                <th key={company.companyId}>
                  <div>
                    <span>{companyNames[company.companyId]}</span>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                    >
                      Hide
                    </Button>
                  </div>
                  </th>
              ))}
            </tr>
          </thead>
        </Table>
      </div>
    </>
  );
};

export default ReduxComparisonTable;
