import React, {Component, useState} from 'react';
import '../styles/Login.css';
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import axios from "axios";

export default function LogoutHandler() {

    const utentiPort = '8080';
    const kubePort = '9000';
    const baseURL = 'http://localhost:' + utentiPort
    localStorage.clear();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await axios(baseURL + '/logout',
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
        window.location.reload(); // perche i link della nav non cambiano
    });

    return null;
}
