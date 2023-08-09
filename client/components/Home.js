import React from 'react'
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {

    const navigate = useNavigate();

   const handleSubmit = async (event) => {
        event.preventDefault();
        let {data} = await axios.post('/api/comparisons', {
            companies: [...competitors,myCompany]
        })
        let comparisonId = data['comparisonId'];
        console.log("We successfully did a comparison! ", comparisonId)
        // navigate(`/comparisons/${comparisonId}`);
    }

    const handleChange = (event) => {
        let index = parseInt(event.target.getAttribute("index"));
        let newCompetitors = [...competitors]
        newCompetitors[index] = event.target.value
        setCompetitors(newCompetitors);
        
    }

    const handleDelete = (event) => {
        let index = parseInt(event.target.getAttribute("index"));
        let newCompetitors = [...competitors]
        console.log("newCompetitors", newCompetitors)
        newCompetitors = newCompetitors.filter((competitor, i) => {
            return i !== index
        })
        setCompetitors(newCompetitors);
    }

    const [myCompany, setMyCompany] = useState("");
    const [competitors, setCompetitors] = useState([""]);
    

    return (
        <main>
            <div id="form-container">
                <form onSubmit ={handleSubmit}>
                    <div id="your-website">
                        <label for="usersWebsite">Your website</label>
                        <input type="url" name="usersWebsite" onChange={(e)=>setMyCompany(e.target.value)}/>
                    </div>
                  
                   {
                    competitors.map((row, index) => {
                        return (
                            <div key={index}>
                                <label for={"competitorsWebsite"+(index+1)}>{`Competitor ${index+1} Website`}</label>
                                <input type="url" name={"competitorsWebsite"+(index+1)} index={index} onChange={handleChange} value={competitors[index]} />
                                <i class="fa-solid fa-trash" index={index} onClick={handleDelete}></i>
                            </div>
                        )
                    })
                   }

                    <button onClick={(e)=> (e.preventDefault(),setCompetitors([...competitors, ""]))}>Add competitor</button>

                    <button>Submit</button>
                    
                </form>
            </div>
        </main>
    )
}

export default Home;