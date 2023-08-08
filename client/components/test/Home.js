import React from "react";
import { useState } from "react";
import axios from "axios";

const Home = () => {
  const handleSubmit = async (event) => {
    event.preventDefault();
    let comparisonData = axios.post("/api/comparisons", {
      companies: competitors,
    });
  };

  const handleChange = (event) => {
    let index = parseInt(event.target.getAttribute("index"));
    let newCompetitors = [...competitors];
    newCompetitors[index] = event.target.value;
    setCompetitors(newCompetitors);
  };

  const handleDelete = (event) => {
    let index = parseInt(event.target.getAttribute("index"));
    let newCompetitors = [...competitors];
    console.log("newCompetitors", newCompetitors);
    newCompetitors = newCompetitors.filter((competitor, i) => {
      return i !== index;
    });
    setCompetitors(newCompetitors);
  };

  const [competitors, setCompetitors] = useState([""]);

  return (
    <main>
      <div className="pt-4 pb-4 d-flex justify-content-center container">
        <form onSubmit={handleSubmit}>
          <div className="text-center" id="your-website">
            <p className="mb-0">What is your company's URL?</p>
            <label for="usersWebsite">Your website</label>
            <input type="url" name="usersWebsite" />
          </div>

        <div className="pt-4 pb-4 text-center">
          <p className="mb-0">Who are your competitor's?</p>
          {competitors.map((row, index) => {
            return (
              <div key={index}>
                <label for={"competitorsWebsite" + (index + 1)}>{`Competitor ${
                  index + 1
                } Website`}</label>
                <input
                  type="url"
                  name={"competitorsWebsite" + (index + 1)}
                  index={index}
                  onChange={handleChange}
                  value={competitors[index]}
                />
                <i
                  class="fa-solid fa-trash"
                  index={index}
                  onClick={handleDelete}
                ></i>
              </div>
            );
          })}
          </div>

          <div className="d-flex flex-column">
            <button
              className="m-1 btn btn-primary"
              onClick={(e) => (
                e.preventDefault(), setCompetitors([...competitors, ""])
              )}
            >
              Add competitor
            </button>

            <button type="submit" className="m-1 btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Home;
