import React, { useState } from 'react';
import axios from 'axios';
import '../js/form-validation.js'

export default function Expenses() {
  const [placeID, setPlaceID] = useState('');
  
  const [stabilimentoId, setStabilimentoId] = useState('');
  const [price, setPrice] = useState('');
  
  const [name, setName] = useState('');
  const [spotsNumber, setSpotsNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const url = 'http://localhost:8080/api/v1';
  
  function handleNewStabGooglePlaceId(e) {
    console.log(placeID);
    setPlaceID('');

    let googlePlaceId = placeID
    // let url = 'http://localhost:8080/api/v1'
    if (googlePlaceId !== '') {
      axios.post(url + '/stabilimenti/create/' + googlePlaceId)
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        }); 
    }
  }

  function handleNewSpot(e) {
    e.preventDefault();
    console.log(stabilimentoId + ' ' + price);

    let stabID = parseInt(stabilimentoId);
    let spotPrice = parseFloat(price);

    if (stabID !== NaN && spotPrice !== NaN) {
      axios.post(url + '/stabilimenti/' + stabID + '/create_spot', {
        price: spotPrice
      })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    //setStabilimentoId('');
    //setPrice('');
  }

  function handleNewStabClick(e) {
    e.preventDefault();
    console.log(name);
    console.log(spotsNumber);
    console.log(address);
    console.log(phone);

    axios.post(url + '/stabilimenti/create', {
      name: name,
      spotsNumber: spotsNumber,
      address: address,
      phoneNumber: phone
    })
      .then(function (response) {
        console.log(response);
        alert(response.data.id);
        setName('');
        setSpotsNumber('');
        setAddress('');
        setPhone('');
      })
      .catch(function (error) {
        console.log(error);
      });

  }
  
  return (
    <div className='container'>
      <header className="py-5">
        <h1>Gestione</h1>
      </header>
      
      <section style={{ padding: "1rem 0" }}>
        <header className="py-3"><h2>Stabilimento</h2></header>

        <div class="d-grid gap-2 col-6 mx-auto">
          {/* <!-- Button trigger new stabilimento with google place id modal --> */}
          <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#newStabGooglePlaceIdModal">
            Nuovo Stabilimento con Google Place ID
          </button>
          {/* <!-- Button trigger new stabiliemtno modal --> */}
          <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#newStabilimentoModal">
            Nuovo Stabilimento
          </button>

        </div>

        {/* <!-- New Stabilimento with google Place ID Modal --> */}
        <div class="modal fade" id="newStabGooglePlaceIdModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Nuovo Stabilimento con Google Place ID</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <div class="mb-3 row">
                  <label for="googlePlaceId" class="col-sm-2 col-form-label">Place ID</label>
                  <div class="col-sm-10">
                    <input type="text" class="form-control" id="googlePlaceId" placeholder="ChIJT46f8fP70hIRYybdwxsjj0I"
                      value={placeID} onChange={e => setPlaceID(e.target.value)} />
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" onClick={handleNewStabGooglePlaceId}>Save changes</button>
              </div>
            </div>
          </div>
        </div>
        
        {/* <!-- Modal --> */}
        <div class="modal fade" id="newStabilimentoModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Nuovo Stabilimento</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <div class="container">
                  <main>

                    <div class="row g-5">
                      <div>
                        <h4 class="mb-3">Dati Stabilimento</h4>
                        <form class="needs-validation" novalidate>
                          <div class="row g-3">
                            <div class="col-sm-12">
                              <label for="firstName" class="form-label">Nome</label>
                              <input type="text" class="form-control" id="firstName" placeholder=""
                                value={name} onChange={e => setName(e.target.value)} required />
                                <div class="invalid-feedback">
                                  Valid name is required.
                                </div>
                            </div>

                            <div class="col-sm-5">
                              <label for="spotsNumber" class="form-label">Numero di Posti</label>
                              <input type="text" class="form-control" id="spotsNumber" placeholder=""
                                value={spotsNumber} onChange={e => setSpotsNumber(e.target.value)} required />
                                <div class="invalid-feedback">
                                  Valid last name is required.
                                </div>
                            </div>

                            <div class="col-7">
                              <label for="phone" class="form-label">Recapito Telefonico</label>
                              <input type="text" class="form-control" id="phone" placeholder="019930462"
                                value={phone} onChange={e => setPhone(e.target.value)} required />
                              <div class="invalid-feedback">
                                Please enter a phone number.
                              </div>
                            </div>

                            <div class="col-12">
                              <label for="address" class="form-label">Indirizzo</label>
                              <input type="text" class="form-control" id="address" placeholder="Via Roma, 58, 17024 Varigotti SV"
                                value={address} onChange={e => setAddress(e.target.value)} required />
                                <div class="invalid-feedback">
                                  Please enter an address.
                                </div>
                            </div>

                          </div>

                          <hr class="my-4"></hr>

                          <button class="w-100 btn btn-primary btn-lg" onClick={handleNewStabClick}>Save changes</button>
                        </form>
                      </div>
                    </div>
                  </main>

                  <footer class="my-5 text-muted text-center text-small">
                    {/* <p class="mb-1">&copy; 2017–2022 Company Name</p>
                    <ul class="list-inline">
                      <li class="list-inline-item"><a href="#">Privacy</a></li>
                      <li class="list-inline-item"><a href="#">Terms</a></li>
                      <li class="list-inline-item"><a href="#">Support</a></li>
                    </ul> */}
                  </footer>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" onClick={handleNewStabClick}>Save changes</button>
              </div>
            </div>
          </div>
        </div>

      </section>
      <section style={{ padding: "1rem 0" }}>
        <header className="py-3"><h2>Spot</h2></header>

        <div class="d-grid gap-2 col-6 mx-auto">
          {/* <!-- Button trigger new spot modal --> */}
          <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#newSpotModal">New Spot</button>
          
          <div class="modal fade" id="newSpotModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLabel">New spot</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <form>
                    <div class="mb-3">
                      <label for="stabilimento-id" class="col-form-label">Stabilimento ID:</label>
                      <input type="text" class="form-control" id="stabilimentoID" placeholder="1"
                        value={stabilimentoId} onChange={e => setStabilimentoId(e.target.value)} />
                    </div>
                    <div class="mb-3">
                      <label for="prezzo" class="col-form-label">Prezzo:</label>
                      <input type="text" class="form-control" id="prezzo" placeholder="37.99"
                        value={price} onChange={e => setPrice(e.target.value)} />
                    </div>
                  </form>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="button" class="btn btn-primary" onClick={handleNewSpot}>Send message</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
    );
  }