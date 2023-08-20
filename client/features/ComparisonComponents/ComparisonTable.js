import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import axios from "axios";
import TypingEffectCell from "./TypingEffectCell";
import { copyTableAsCSV } from "../helperFunctions";



const ComparisonTable = ({ title, companies, doTypingEffect, comparisonId }) => {
  const [showColumns, setShowColumns] = useState({});
  const [headers, setHeaders] = useState([]);
  const [companyIds, setCompanyIds] = useState([]);
  const [companyNames, setCompanyNames] = useState({});
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
      let calculatedWidth = `${80 / (companies.length || 1)}%`
      setCalculatedWidth(calculatedWidth);
      console.log(calculatedWidth);
    }
    

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
            {headers && headers.map((header) => (
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
