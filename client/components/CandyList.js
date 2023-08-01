import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchCandyAsync, selectCandy } from "../app/features/candySlice";

const CandyList = () => {
    const dispatch = useDispatch();
    const candies = useSelector(selectCandy)

    useEffect(() => {
        dispatch(fetchCandyAsync())
    }, [dispatch])

    return (
        <div>
            <h1>Candy List</h1>
            <ul>
                {candies.map((candy) => {
                    return (
                        <li key={candy.id}>
                            <h2><Link to={`/candies/${candy.id}`}>{candy.name}</Link></h2>
                        </li>
                    )
                })
                }
            </ul>
        </div>
    )
}

export default CandyList