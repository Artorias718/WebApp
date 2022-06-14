import React, {Component, useState} from 'react';
import '../styles/Login.css';
import { GOOGLE_AUTH_URL, FACEBOOK_AUTH_URL, GITHUB_AUTH_URL, ACCESS_TOKEN } from '../constants';


import googleLogo from '../img/google-logo.png';
import fbLogo from '../img/fb-logo.png';
import githubLogo from '../img/github-logo.png';
import {useContext} from "react";


export default function Login() {


    return (
            <div className="login-container">
                <div className="login-content">
                    <h1 className="login-title">Login</h1>
                    <div className="social-login">
                        <a className="btn btn-block social-btn google" href={GOOGLE_AUTH_URL}>
                            <img src={googleLogo} alt="Google" /> Log in with Google</a>
                        <a className="btn btn-block social-btn facebook" href={FACEBOOK_AUTH_URL}>
                            <img src={fbLogo} alt="Facebook" /> Log in with Facebook</a>
                        <a className="btn btn-block social-btn github" href={GITHUB_AUTH_URL}>
                            <img src={githubLogo} alt="Github" /> Log in with Github</a>
                    </div>
                   
                </div>
            </div>

    );
  }
