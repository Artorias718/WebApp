import React, { useState } from 'react';
import axios from 'axios';

export default function Expenses() {
  const [placeID, setPlaceID] = useState('');
  
  function handleNewStabGooglePlaceId(e) {
    
    console.log(placeID);
    setPlaceID('');

    let googlePlaceId = placeID
    let url = 'http://localhost:8080/api/v1'
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
  
  return (
      <main style={{ padding: "1rem 0" }}>
        <h2>Gestione</h2>
        {/* <!-- Button trigger modal --> */}
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
          Nuovo Stabilimento con Google Place ID
        </button>

        {/* <!-- Modal --> */}
        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
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

      </main>
    );
  }