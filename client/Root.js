import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import CandyList from "./components/CandyList";

const Root = () => {
  return (
    <div>
      <nav>
        <Link to='/'>Goodie Bag</Link>
        <Link to='/candies'>List of Candy</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/candies' element={<CandyList />} />
      </Routes>
    </div>
  );
};

export default Root;
