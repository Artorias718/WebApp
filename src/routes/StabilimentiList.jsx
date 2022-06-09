import React, { useState, useEffect } from 'react';
import {
  NavLink,
  Outlet,
  useSearchParams,
  useLocation
} from "react-router-dom";
import axios from 'axios';
import 'react-calendar/dist/Calendar.css';
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css'
import '../css/stabilimenti.css';
import '../css/myDatePicker.css'

export default function Stabilimenti() {
  let [searchParams, setSearchParams] = useSearchParams();
  
  // recupero la data della sessionStorage, per il caso quando si torna 
  // indietro della pagina del dettaglio dello stabilimento
  let sDate = sessionStorage.getItem('selectedDate');
  // console.log('session storage: ' + sDate);
  if (sDate === null) {
    sDate = new Date();
    sessionStorage.setItem('selectedDate', sDate);
  }
  
  const [stabilimenti, setStabilimenti] = useState([]);
  const [value, onChange] = useState(new Date(sDate));

  const API_KEY = 'AIzaSyAk5gXXtzL3bDr--V7jI71K42Bb1Yp7fwY'

  useEffect(() => {
    // console.log('runned useEffect stabilimentiList');
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
  }, [value]);

  function handleDateSelection(date) {
    console.log('handleDateSelection: ' + date)
    onChange(date);
    sessionStorage.setItem('selectedDate', date);
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
                </div>
                <div class="row mb-3">
                  <label htmlFor="colFormLabel" class="col-sm-4 col-form-label">Seleziona la Data</label>
                  <div class="col-md-4">
                    <div>
                      <DatePicker className='form-control'
                        onChange={handleDateSelection}
                        value={value}
                        format={"dd/MM/yyyy"}
                        minDate={new Date()} />
                    </div>
                  </div>
                  <div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </header>
      <section class="py-5">
        <div class="container px-4 px-lg-5 mt-5">
          {/* <header className="py-3"><h2>Stabilimenti</h2></header> */}
          
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
                  <div class="stabCard h-100">
                    {/* <!-- Sale badge--> */}
                    <div class="badge bg-dark text-white position-absolute" style={{ top: '0.5rem', right: '0.5rem' }}>Sale</div>
                    {/* <!-- Product image--> */}
                    <img class="card-img-top"
                      // src={ stabilimento.id <= 10 ? require('../assets/img/' + stabilimento.id + '.jpg') :
                      // require('../assets/img/' + stabilimento.id % 10 + '.jpg')}
                      src={stabilimento.photoRef !== null ?
                        'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=' + stabilimento.photoRef + '&key=' + API_KEY
                        : require('../assets/img/chesapeake-samples.png') }
                      alt="..." />
                    {/* <!-- Product details--> */}
                    <div class="card-body p-4">
                      <div class="text-center">
                        {/* <!-- Product name--> */}
                        <h5 class="fw-bolder">{stabilimento.name}</h5>
                        {/* <!-- Product reviews--> */}
                        <div class="d-flex justify-content-center small text-warning mb-2">
                          <span style={{ marginRight: "5px", color: "#70757a", whiteSpace: "nowrap" }}
                          >{stabilimento.rating > 0 ? stabilimento.rating : ''}</span>
                          <ReviewStars rating={stabilimento.rating} />
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

function ReviewStars({ rating }) {
  let integerPart = Math.trunc(rating);
  let stars = new Array(integerPart);

  for (let i = 0; i < integerPart; i++) {
    stars[i] = i;
  }
  
  let decimalpart = (rating * 10) % 10;

  return(
    <>
      {stars.map(s =>
        <div class="bi-star-fill" key={s}></div>
        )
      }
      {decimalpart > 3 && decimalpart < 7 ? <div class="bi-star-half"></div> : ''}
      {decimalpart >= 7 ? <div class="bi-star-fill"></div> : ''}
      
    </>
  )
}