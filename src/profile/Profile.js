import './Profile.css';
import React, {useContext, useState, useCallback, useEffect} from 'react'
import { getCurrentUser } from '../Utils';

import axios from 'axios';
import {authContext} from "../App";

export default function Profile() {


    return (
            <div className="profile-container">
                <h2>--{localStorage.isAuth}--</h2>
                <div className="container">
                    <div className="profile-info">
                        <div className="profile-avatar">
                            { 
                                localStorage.img ? (
                                    <img src={localStorage.img}/>
                                ) : (
                                    <div className="text-avatar">
                                        <span>{localStorage.name}</span>
                                    </div>
                                )
                            }
                        </div>
                        <div className="profile-name">
                           <h2>{localStorage.name}</h2>
                           <p className="profile-email">{localStorage.email}</p>
                        </div>
                    </div>
                </div>    
            </div>
  );
}