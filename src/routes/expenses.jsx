import React, { useState } from 'react';
import axios from 'axios';

export default function Expenses() {
  const [placeID, setPlaceID] = useState('');
  const [stabilimentoId, setStabilimentoId] = useState('');
  const [price, setPrice] = useState('');
  
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
  
  return (
      <main style={{ padding: "1rem 0" }}>
        <h2>Gestione</h2>
        {/* <!-- Button trigger new stabilimento with google place id modal --> */}
        <div class="d-grid gap-2 col-6 mx-auto">
          <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#newStabGooglePlaceIdModal">
            Nuovo Stabilimento con Google Place ID
          </button>
          {/* <!-- Button trigger new spot modal --> */}
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#newSpotModal">New Spot</button>

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


      </main>
    );
  }