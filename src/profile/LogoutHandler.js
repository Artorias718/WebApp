import React, {Component, useState} from 'react';
import '../styles/Login.css';
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import axios from "axios";

export default function LogoutHandler() {

    localStorage.clear();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await axios('http://localhost:8080/logout',
                    { withCredentials: true },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        }});

                localStorage.clear();

            } catch (error) {
                console.log(error);
                alert(error);
            }

        };

        fetchData(); }, []);


    const navigate = useNavigate();
    React.useEffect(() => {
        navigate('/home');
    });

    return null;
}
