import React from 'react';
import {
    Outlet
  } from "react-router-dom";
import '../css/stabilimenti.css';

export default function stabilimenti() {
  return (
    <>
        <Outlet /> 
    </>
    
  );
}