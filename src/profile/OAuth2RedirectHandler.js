import React, {Component, useState, useEffect, createContext, useContext, useMemo} from 'react';
import {GetCurrentUser, getCurrentUser} from '../Utils';
import {useNavigate} from "react-router-dom";
import {authContext} from "../App";


export default function OAuth2redirectHandler(){

    //const { authenticated, setAuthenticated } = useContext(authContext);

    GetCurrentUser();

    localStorage.setItem('isAuth',true);


    const navigate = useNavigate();
    React.useEffect(() => {
        navigate('/profile');
        window.location.reload(); // perche i link della nav non stano cambiando bene
    });

    return null;
}
