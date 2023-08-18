import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Form, Row, Button, Stack } from "react-bootstrap";

const LandingPage = () => {

    const navigate = useNavigate();

    return (
        <div id="landing-page-top">
            <h1>See how your company measures up.</h1>
            <h3>Compare SaaS companies and get notified when things change.</h3>
            <h3>Like Google Alerts on Steroids.</h3>
            <button onClick={()=>navigate("/compare")}>Get Started</button>
        </div>
        
    )
}

export default LandingPage