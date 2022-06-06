import React, { useState, useEffect } from 'react';
import {
  NavLink,
  Outlet,
  useSearchParams,
  useLocation
} from "react-router-dom";
import axios from 'axios';
// import { Card, Button, Row, Stack } from 'react-bootstrap';
// import Container from 'react-bootstrap/Container';
// import logo from '../logo.svg';
import '../css/stabilimenti.css';
// import DateTime from '../utils/DateTime.js'
// import '../css/myDatePicker.css'

export default function Stabilimenti() {
  let [searchParams, setSearchParams] = useSearchParams();

  const [stabilimenti, setStabilimenti] = useState([]);

  const API_KEY = 'AIzaSyAk5gXXtzL3bDr--V7jI71K42Bb1Yp7fwY'
  
  function formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }

  const date = new Date();
  console.log('to locale: ' + date.toLocaleDateString('it-IT'));
  const event = new Date(Date.UTC(2012, 11, 20, 3, 0, 0));
  // const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const options = { year: 'numeric', month: 'numeric', day: 'numeric' };

  console.log(event.toLocaleDateString('it-IT', options));

  let today = formatDate(date);
  console.log(today);

  const data = new Date().toLocaleDateString('it-IT');
  console.log(data);

  const [initialDate, setInitialDate] = useState(today);

  useEffect(() => {
    const fetchData = async () => {

      try {
        const result = await axios('http://localhost:8080/api/v1/stabilimenti/');

        setStabilimenti(result.data);
      } catch (error) {
        console.log(error);
        alert(error);
      }

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

  // Save data to sessionStorage
  // sessionStorage.setItem('key', 'value');

  // Get saved data from sessionStorage
  // let data = sessionStorage.getItem('key');
  // console.log(data);

  function setDate(e) {
    e.preventDefault();
    let selectedDate = e.target.value;
    console.log('selected date: ' + selectedDate);
    setInitialDate(selectedDate);
    console.log('initial date: ' + initialDate);
    sessionStorage.setItem('selectedDate', selectedDate);
  }

  return (
    <>
      <header class="masthead">
        <div class="container position-relative">
          <div class="row justify-content-center">
            <div class="col-xl-6">
              <div class="text-center text-white">
                <h1 class="mb-5">Le migliori spiaggie a un click!</h1>
                <div class="row mb-3">
                  <div class="col">
                    {/* <input class="form-control form-control-lg" id="emailAddress" placeholder="Search location" /> */}
                    <input
                      className="form-control form-control-lg"
                      placeholder="Dove vuoi andare?"
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
                  </div>
                  {/* <div class="col-auto"><button class="btn btn-primary btn-lg" id="submitButton" type="submit">Submit</button></div> */}
                </div>
                <div class="row mb-3">
                  <label for="colFormLabel" class="col-sm-4 col-form-label">Seleziona la Data</label>
                  <div class="col-md-4">
                    <input className="form-control" type="date" id="start" name="trip-start"
                      value={initialDate} 
                      onChange={setDate}
                      min={today} />
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </header>
      <section class="py-5">
        <div class="container px-4 px-lg-5 mt-5">
          <h2>Stabilimenti</h2>
          <div class="row gx-4 gx-lg-5 row-cols-1 row-cols-md-2 row-cols-xl-3 justify-content-center">
            {stabilimenti
              .filter((stabilimento) => {
                let filter = searchParams.get("filter");
                if (!filter) return true;
                let name = stabilimento.name.toLowerCase();
                return name.includes(filter.toLowerCase());
              })
              .map((stabilimento) => (
                <div class="col mb-5" key={stabilimento.id}>
                  <div class="card h-100">
                    {/* <!-- Sale badge--> */}
                    <div class="badge bg-dark text-white position-absolute" style={{ top: '0.5rem', right: '0.5rem' }}>Sale</div>
                    {/* <!-- Product image--> */}
                    <img class="card-img-top"
                      // src={ stabilimento.id <= 10 ? require('../assets/img/' + stabilimento.id + '.jpg') :
                      // require('../assets/img/' + stabilimento.id % 10 + '.jpg')}
                      // src='https://lh3.googleusercontent.com/places/AAcXr8qU5TgblPL2xi8n_5WjwK-jXDg_E5kziDW48WmwRW7r2o06B7-ve00rJRS4VW8pov_CuC-CaZsZi7Bu1aTA7W_9NhcvBavjbTw=s1600-w400'
                      src={'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=' + stabilimento.photoRef + '&key=' + API_KEY}
                      alt="..." />
                    {/* <!-- Product details--> */}
                    <div class="card-body p-4">
                      <div class="text-center">
                        {/* <!-- Product name--> */}
                        <h5 class="fw-bolder">{stabilimento.name}</h5>
                        {/* <!-- Product reviews--> */}
                        <div class="d-flex justify-content-center small text-warning mb-2">
                          <div class="bi-star-fill"></div>
                          <div class="bi-star-fill"></div>
                          <div class="bi-star-fill"></div>
                          <div class="bi-star-fill"></div>
                          <div class="bi-star-fill"></div>
                        </div>
                        {/* <!-- Product price--> */}
                        <span class="text-muted text-decoration-line-through">$40.00</span>
                        $20.00 - $80.00 <br />
                        <i class="bi bi-telephone-fill"></i> {stabilimento.phoneNumber}
                      </div>
                    </div>
                    {/* <!-- Product actions--> */}
                    <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                      <div class="text-center">
                        <QueryNavLink
                          className="btn btn-outline-dark mt-auto"
                          to={`/stabilimenti/${stabilimento.id}`}
                        >
                          View options
                        </QueryNavLink>
                        {/* <a class="btn btn-outline-dark mt-auto" href="#">View options</a> */}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>
      <Outlet />
    </>
  );
}


function QueryNavLink({ to, ...props }) {
  let location = useLocation();
  return <NavLink to={to + location.search} {...props} />;
}