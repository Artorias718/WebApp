import React, { useState, useEffect } from 'react';
import {
    NavLink,
    Outlet,
    useSearchParams,
    useLocation
  } from "react-router-dom";
import axios from 'axios';
  
export default function Stabilimenti() {
    let [searchParams, setSearchParams] = useSearchParams();
  
    const [stabilimenti, setStabilimenti] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        // setIsLoading(true);
  
        try {
            const result = await axios('http://localhost:8080/api/v1/stabilimenti/');
  
            setStabilimenti(result.data);
        } catch (error) {
            console.log(error);
            alert(error);
        }
        
        // setIsLoading(false);
      };
  
      fetchData();
  
      const setData = () => {
        let stabilimentiList = [
          {
              "id": 1,
              "name": "Bagni Liguria",
              "rowQty": 3,
              "columnQty": 4,
              "address": "Viale Rimembranza, 38, 16039 Sestri Levante GE",
              "phoneNumber": "0185 482131",
              "spotsNumber": 12
          },
          {
              "id": 2,
              "name": "Bagni Castelletto",
              "rowQty": 2,
              "columnQty": 5,
              "address": "Via Aurelia, 17024 Finale Ligure SV",
              "phoneNumber": "019 600106",
              "spotsNumber": 10
          },
          {
              "id": 3,
              "name": "Capo Torre Beach & Lounge",
              "rowQty": 5,
              "columnQty": 3,
              "address": "Via Aurelia di Ponente, 1, 17015 Celle Ligure SV",
              "phoneNumber": "019 221 6264",
              "spotsNumber": 15
          },
          {
              "id": 4,
              "name": "Bagni Vittoria Beach",
              "rowQty": 4,
              "columnQty": 5,
              "address": "Lungomare Augusto Migliorini, 17024 Finale Ligure SV",
              "phoneNumber": "019 695583",
              "spotsNumber": 20
          },
          {
              "id": 5,
              "name": "Bagni Al Saraceno",
              "rowQty": 2,
              "columnQty": 7,
              "address": "Via del Capo, 2, 17024 Finale ligure SV",
              "phoneNumber": "019 698 8187",
              "spotsNumber": 14
          }
      ];
        setStabilimenti(stabilimentiList);
      };
  
      // setData();
    }, []);

    return (
      <div style={{ display: "flex" }}>
        <nav
          style={{
            borderRight: "solid 1px",
            padding: "1rem",
          }}
        >
          <input
            value={searchParams.get("filter") || ""}
            onChange={(event) => {
              let filter = event.target.value;
              if (filter) {
                setSearchParams({ filter });
              } else {
                setSearchParams({});
              }
            }}
          />
          {stabilimenti
            .filter((stabilimento) => {
              let filter = searchParams.get("filter");
              if (!filter) return true;
              let name = stabilimento.name.toLowerCase();
              return name.includes(filter.toLowerCase());
            })
            .map((stabilimento) => (
              <QueryNavLink
                style={({ isActive }) => ({
                  display: "block",
                  margin: "1rem 0",
                  color: isActive ? "red" : "",
                })}
                to={`/stabilimenti/${stabilimento.id}`}
                key={stabilimento.id}
              >
                {stabilimento.name}
              </QueryNavLink>
            ))}
        </nav>
        <Outlet />
      </div>
    );
  }
  
  
  function QueryNavLink({ to, ...props }) {
    let location = useLocation();
    return <NavLink to={to + location.search} {...props} />;
  }