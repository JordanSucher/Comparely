import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import axios from "axios";
import TypingEffectCell from "./TypingEffectCell";
import { copyTableAsCSV } from "../helperFunctions";



const ComparisonTable = ({ title, companies, doTypingEffect, comparisonId }) => {
  const [showColumns, setShowColumns] = useState({});
  const [headers, setHeaders] = useState(['Feature One', 'Feature Two', 'Feature Three']);
  const [companyIds, setCompanyIds] = useState([]);
  const [calculatedWidth, setCalculatedWidth] = useState(0);

  const toggleColumns = (companyName) => {
    if(Object.values(showColumns).filter(v=>v==true).length > 1 || !showColumns[companyName]) {
      setShowColumns({
        ...showColumns,
        [companyName]: !showColumns[companyName],
      });
    }
  };

  const handleSubmit = async (e) => {
    // prevent default
    e.preventDefault();

    // get vars ready
    let companies = companyIds
    let featureName = e.target.featureName.value;
    e.target.featureName.value = "";
    
    // call server
    await axios.post('/api/comparisons/features', {
      comparisonId: comparisonId,
      companies: companies,
      featureName: featureName
    })

  }

  useEffect(() => {
    const initialShowColumns = {};
    const tempCompanyIds = [];


    if (companies && companies[0] && companies[0].features && companies[0].features.length > 0) {
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
      let calculatedWidth = `${80 / (companies.length || 1)}%`
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

const getFirstTwoSentences = (text) => {
  // Split by sentences and grab first 2
  // also, strip the source citing
  if(text) {
    let strippedText = text.replace(/\[\d+\]/g, '');
    const sentences = strippedText.match(/[^.!?]+[.!?]/g)
    return sentences?.slice(0, 1).join(' ') || '';
  };
  
  // Take the first three
  
};

  return (
    <>

      <div id="hidden-companies">
        {/* { Object.values(showColumns).includes(false) ? 
           <h4 id="hidden-companies-header">Hidden Companies</h4> : ""
        } */}

        {companies && companies.map((company) => {
          if(showColumns[company.companyId]) {
            return ""
          } else if (companyNames[company.companyId]){
            return (
              <div className="hidden-company" onClick={()=>toggleColumns(company.companyId)}> 
              <i className="fa-solid fa-circle-xmark hidden-co-remove" style={{color: "#e8e8e8"}}></i>
              <Button className="hidden-co-icon">
                {companyNames[company.companyId].slice(0,1).toUpperCase()}
              </Button>
              </div>
            )
          }
          
          })}
      </div>

      <div id="company-profile">
        <span>
          <h4 className="table-header">{title}</h4>
          <i className="fa-solid fa-copy copy-icon" onClick={()=>copyTableAsCSV("#comparison-table")}></i>
        </span>
        <Table striped bordered hover id="comparison-table">
          <thead>
            <tr>
              <th ></th>
              {companies && companies.map((company) => {
                
                if (showColumns[company.companyId]) {
                return (
                <th key={company.companyId} style={{ minWidth: calculatedWidth }}>
                  <div className="d-flex justify-content-center align-items-center">
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
              )}

              else {
                return ""
              }
              
              })}
            </tr>
          </thead>

      <tbody>
        <>
          {headers &&
            headers.map((header) => (
              <tr key={header}>
                <td>{header}</td>
                {companies && companies.map((company) => {
                  
                  if (company.features.find((feature) => feature.key === header)?.value && company.features.find((feature) => feature.key === header)?.value.length > 0) {
                  return (
                          <TypingEffectCell
                          key={`${company.companyId}-${header}`}
                          hidden={!showColumns[company.companyId]}
                          doTypingEffect={doTypingEffect}
                          fullText={getFirstTwoSentences(company.features.find((feature) => feature.key === header)?.value)}
                        />
                  ) }
                  else {
                    return (
                      <td className="loading-cell"></td>
                    )
                  }
                  }  
                  )}
              </tr>
            ))}

             { companies && companies[0] && companies[0].features && companies[0].features.length > 0 && <tr>
                <td>
                  <form onSubmit={handleSubmit}>
                  <input name="featureName" type="text" placeholder="Add feature" ></input>
                  </form>
                </td>
              </tr> }

          </tbody>


        </Table>
      </div>
    </>
  );
};

export default ComparisonTable;
