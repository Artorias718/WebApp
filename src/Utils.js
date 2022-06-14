import {useEffect } from 'react';
import axios from "axios";

export function GetCurrentUser() {

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await axios.get('http://localhost:8080/api/v1/user/me',
                    { withCredentials: true },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        }});

                localStorage.setItem('email',result.data.email);
                localStorage.setItem('name',result.data.given_name);
                localStorage.setItem('img',result.data.picture);
                localStorage.setItem('user',result.data.email);

                //mettere if ISAUTH (ancora da definire) a true


            } catch (error) {
                console.log(error);
                alert(error);
            }

        };

        fetchData(); }, []);

}