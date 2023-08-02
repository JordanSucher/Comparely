import React from 'react'
import { useState } from 'react';

const Home = () => {

   const handleSubmit = (event) => {
        event.preventDefault();
        console.log(competitors)
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

    const [competitors, setCompetitors] = useState([""]);
    

    return (
        <main>
            <div id="form-container">
                <form onSubmit ={handleSubmit}>
                    <div id="your-website">
                        <label for="usersWebsite">Your website</label>
                        <input name="usersWebsite" type="text" />
                    </div>
                  
                   {
                    competitors.map((row, index) => {
                        return (
                            <div key={index}>
                                <label for={"competitorsWebsite"+(index+1)}>{`Competitor ${index+1} Website`}</label>
                                <input name={"competitorsWebsite"+(index+1)} index={index} onChange={handleChange} value={competitors[index]} type="text" />
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