import React, { useState, useEffect } from 'react';
import {
  useParams,
  useNavigate,
  useLocation,
} from "react-router-dom";
import axios from 'axios';
import './mappa.css';
//import backImg from '../src/assets/img/bg.jpg';
// import '../src/js/form-validation.js'

export default function Mappa() {
  let navigate = useNavigate();
  let location = useLocation();
  let params = useParams();
  let stabilimentoId = parseInt(params.stabilimentoId, 10);

  const [seat, setSeat] = useState([]);
  const [seatAvailable, setSeatAvailable] = useState([]);
  const [seatReserved, setSeatReserved] = useState([]);
  const [stabilimento, setStabilimento] = useState([]);

  // Get saved data from sessionStorage
  let sDate = sessionStorage.getItem('selectedDate');
  console.log(sDate);
  const [selectedDate, setSelectedDate] = useState(sDate);

  const today = formatDate(new Date());

  const items = {};

  /* {
        "id": 6,
        "price": 50.99,
        "row": 0,
        "column": 0,
        "active": true,
        "booked": false,
        "stabId": 1
    } */

  useEffect(() => {
    console.log('runned useEffect');
    const fecthStabilimentoData = async (id) => {
      try {
        const result = await axios('http://localhost:8080/api/v1/stabilimenti/' + id);

        setStabilimento(result.data);

      } catch (error) {
        
      }
    };

    const fetchData = async () => {
      // setIsLoading(true);

      try {
        const result = await axios('http://localhost:8080/api/v1/stabilimenti/' + stabilimentoId + '/lista_Posti');

        setSeat(result.data);
        setSeatAvailable(result.data.filter(s => s.booked === false));
        setSeatReserved([]);
      } catch (error) {
        console.log(error);
        alert(error);
      }

      // setIsLoading(false);
    };

    fecthStabilimentoData(stabilimentoId);

    fetchData();

    // const setData = () => {
    //   let seatList = [
    //     { "id": 1, "booked": false }, { "id": 2, "booked": false }, { "id": 3, "booked": false },
    //     { "id": 4, "booked": false }, { "id": 5, "booked": false }, { "id": 6, "booked": false },
    //     { "id": 7, "booked": true }, { "id": 8, "booked": true }, { "id": 9, "booked": true }
    //   ];
    //   setSeat(seatList);
    //   setSeatAvailable(seatList.filter(s => s.booked === false));
    //   setSeatReserved([]);
    // };

    // setData();
  }, [stabilimentoId, selectedDate]);// in teoria se cambio uno dei due valori -> esegue useEffect

  // metodo che permette di aggiornare i posti scelti dall'utente
  const onClickData = (seat) => {
    if (seat.booked) {
      alert('Posto: ' + seat.id + ' non disponibile!');
    }
    else {
      if (seatReserved.findIndex((element) => element.id === seat.id) > -1) {
        setSeatAvailable(seatAvailable.concat(seat));
        setSeatReserved(seatReserved.filter(res => res.id !== seat.id));
      } else {
        setSeatReserved(seatReserved.concat(seat));
        setSeatAvailable(seatAvailable.filter(res => res.id !== seat.id));
      }
    }
  };

  // metodo handle per conferma/prenota
  function handlePrenotaSubmit(e) {
    e.preventDefault();
    // console.log('You clicked submit.');
    // console.log('stabilimentoID: ' + stabilimentoId);
    console.log(seatReserved);
    let reservedIds = seatReserved.map(s => s.id);
    console.log(reservedIds);

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce#sum_of_values_in_an_object_array
    let initialValue = 0;
    let totalPrice = seatReserved.reduce(
      (previousValue, currentValue) => previousValue + currentValue.price,
      initialValue
    );

    console.log(totalPrice);

    // qua sarebbe interessante un modal o una pagina a parte per il checkout
    let msg = 'Conferma la prenotazione dei posti: ' +
      seatReserved.map(s => '\n\tPosto: ' + s.id + ' - prezzo: € ' + s.price) +
      '\nPrezzo totale: €' + totalPrice;
    if (window.confirm(msg)) {
      // alert("exit.html", "Thanks for Visiting!");
      // faccio la post con stabilimentoId, reservedSeatsId, totalPrice
      axios.post('http://localhost:7500/api/v2/prenotazioni/create', {
        "stabilimentoID": stabilimentoId,
        "listaPostiPrenotati": reservedIds,
        "totalPrice": totalPrice,
        "date": selectedDate 
      })
        .then(function (response) {
          console.log(response);
          alert("Prenotazione andata a buon fine");
          navigate("/stabilimenti" + location.search);
        })
        .catch(function (error) {
          console.log(error);
          alert(error);
        });
    }

  }

  function setDate(e) {
    console.log(e.target.value);

    const date = e.target.value;

    let newDate = new Date();
    console.log(date);
    setSelectedDate(date);
    console.log(selectedDate);
    sessionStorage.setItem('selectedDate', date);
  }

  return (
    <>
      <div className='myMap'>
        <header class="py-5">
          {/* <header className="masthead"> */}

          <div class="overlay"></div>
          <div class="container">
            <div class="row">
              <div class="col-lg-8 col-md-10 mx-auto">
                <div class="post-heading text-white">
                  <h1>{stabilimento.name}</h1>
                  <h4>Stabilimento Balneare sito in {stabilimento.address}.</h4>
                  <p><i class="bi bi-telephone-fill"> {stabilimento.phoneNumber}</i> </p>

                  <span class="meta"><p><em>I servizi offerti</em></p>
                    <p>Vasta e variegata è la gamma di servizi. Ampi ombrelloni e comode sdraio 
                    assicureranno protezione e relax nei momenti in cui i raggi solari scottano di più.</p>
                  </span>
                </div>
              </div>
            </div>
            
            <div class="row justify-content-center">
              <div class="col-xl-6">
                <div class="text-center text-white">
                  <div class="row mb-3">
                    <label for="colFormLabel" class="col-sm-4 col-form-label">Data</label>
                    <div class="col-md-4">
                      <input className="form-control" type="date" id="start" name="trip-start"
                        value={selectedDate}
                        onChange={setDate}
                        min={today} />
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </header>
        <section class="py-5 text-white">
          <h1 class="mb-5">Seleziona la postazione</h1>
          <DrawGrid
            seat={seat}
            available={seatAvailable}
            reserved={seatReserved}
            onClickData={onClickData.bind(this)}
          />
        </section>
        <section class="py-5 text-white">
          <div class="container">
            <div class="row">
              <div class="col-lg-8 col-md-10 mx-auto justify-content-end" style={{ justifyContent: "right" }}>
                <div class="d-grid gap-4 d-md-flex justify-content-md-end">
                  <button class="btn btn-light" type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      // deleteInvoice(invoice.number);
                      navigate("/stabilimenti" + location.search);
                    }}
                  >Back</button>
                  <a class="btn btn-primary" data-bs-toggle="modal" href="#checkoutModalToggle" role="button">Prenota</a>
                  {/* <button class="btn btn-primary me-md-2" type="button"
                    onClick={handleSubmit
                      // () => {
                      // deleteInvoice(invoice.number);
                      // navigate("/invoices" + location.search);
                      // }
                    }
                  >Prenota</button> */}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div class="modal fade" id="checkoutModalToggle" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabindex="-1">
        <div class="modal-dialog modal-xl modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalToggleLabel">Conferma Prenotazione</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="container">
                <main>
                  {/* <div class="py-5 text-center">
                    <img class="d-block mx-auto mb-4" src="../assets/brand/bootstrap-logo.svg" alt="" width="72" height="57" />
                      <h2>Checkout</h2>
                      <p class="lead">Below is an example form built entirely with Bootstrap’s form controls. Each required form group has a validation state that can be triggered by attempting to submit the form without completing it.</p>
                  </div> */}

                  <div class="row g-5">
                    <div class="col-md-5 col-lg-4 order-md-last">
                      <Cart reserved={seatReserved} />

                      <form class="card p-2">
                        <div class="input-group">
                          <input type="text" class="form-control" placeholder="Codice Promo" />
                            <button type="submit" class="btn btn-secondary" onClick={e => e.preventDefault()}>Applica</button>
                        </div>
                      </form>
                    </div>
                    <div class="col-md-7 col-lg-8">
                      <h4 class="mb-3">Riepilogo</h4>
                      <div class="row gy-3">
                        <div class="row">
                          <label for="colFormLabel" class="col-sm-2 col-form-label">Data:</label>
                          <div class="col-md-3">
                            <input type="text" readonly class="form-control-plaintext" id="riepData" value={formatDate(selectedDate)} />
                          </div>
                        </div>

                        <div class="row">
                          {/* la col-lg-2 fa si che si sovrappongono le scritte in alcune misure di finestra */}
                          <label for="colFormLabel" class="col-sm-3 col-md-3 col-lg-2 col-form-label">Stabilimento:</label>
                          <div class="col-sm-10">
                            <input type="text" readonly class="form-control-plaintext" id="riepStab" value={stabilimento.name} />
                          </div>
                        </div>
                      </div>

                      <hr class="my-4"></hr>

                      <h4 class="mb-3">Dati per la Fatturazione</h4>
                      <form class="needs-validation" novalidate>
                        <div class="row g-3">
                          <div class="col-sm-6">
                            <label for="firstName" class="form-label">Nome</label>
                            {/* <input type="text" class="form-control" id="firstName" placeholder="" value="" required /> */}
                            <input type="text" class="form-control" id="firstName" placeholder="" required />
                              <div class="invalid-feedback">
                                Valid first name is required.
                              </div>
                          </div>

                          <div class="col-sm-6">
                            <label for="lastName" class="form-label">Cognome</label>
                            {/* <input type="text" class="form-control" id="lastName" placeholder="" value="" required /> */}
                            <input type="text" class="form-control" id="lastName" placeholder="" required />
                              <div class="invalid-feedback">
                                Valid last name is required.
                              </div>
                          </div>

                          <div class="col-12">
                            <label for="username" class="form-label">Username</label>
                            <div class="input-group has-validation">
                              <span class="input-group-text">@</span>
                              <input type="text" class="form-control" id="username" placeholder="Username" required />
                                <div class="invalid-feedback">
                                  Your username is required.
                                </div>
                            </div>
                          </div>

                          <div class="col-12">
                            <label for="email" class="form-label">Email <span class="text-muted">(Optional)</span></label>
                            <input type="email" class="form-control" id="email" placeholder="you@example.com" />
                              <div class="invalid-feedback">
                                Please enter a valid email address for shipping updates.
                              </div>
                          </div>

                          <div class="col-12">
                            <label for="address" class="form-label">Indirizzo</label>
                            <input type="text" class="form-control" id="address" placeholder="1234 Main St" required />
                              <div class="invalid-feedback">
                                Please enter your shipping address.
                              </div>
                          </div>

                          <div class="col-12">
                            <label for="address2" class="form-label">Indirizzo 2 <span class="text-muted">(Optional)</span></label>
                            <input type="text" class="form-control" id="address2" placeholder="Apartment or suite" />
                          </div>

                          <div class="col-md-5">
                            <label for="country" class="form-label">Nazione</label>
                            <select class="form-select" id="country" required>
                              <option value="">Scegli...</option>
                              <option>Italia</option>
                            </select>
                            <div class="invalid-feedback">
                              Please select a valid country.
                            </div>
                          </div>

                          <div class="col-md-4">
                            <label for="state" class="form-label">Provincia</label>
                            <select class="form-select" id="state" required>
                              <option value="">Scegli...</option>
                              <option>Cuneo</option>
                            </select>
                            <div class="invalid-feedback">
                              Please provide a valid state.
                            </div>
                          </div>

                          <div class="col-md-3">
                            <label for="zip" class="form-label">CAP</label>
                            <input type="text" class="form-control" id="zip" placeholder="" required />
                              <div class="invalid-feedback">
                                Zip code required.
                              </div>
                          </div>
                        </div>

                        <hr class="my-4"></hr>

                        <div class="form-check">
                          <input type="checkbox" class="form-check-input" id="same-address" />
                            <label class="form-check-label" for="same-address">Shipping address is the same as my billing address</label>
                        </div>

                        <div class="form-check">
                          <input type="checkbox" class="form-check-input" id="save-info" />
                            <label class="form-check-label" for="save-info">Save this information for next time</label>
                        </div>

                        <hr class="my-4"></hr>

                        <h4 class="mb-3">Modalita' di Pagamento</h4>

                        <div class="my-3">
                          <div class="form-check">
                            <input id="credit" name="paymentMethod" type="radio" class="form-check-input" checked required />
                              <label class="form-check-label" for="credit">Carta di Credito</label>
                          </div>
                          <div class="form-check">
                            <input id="debit" name="paymentMethod" type="radio" class="form-check-input" required />
                              <label class="form-check-label" for="debit">Satispay</label>
                          </div>
                          <div class="form-check">
                            <input id="paypal" name="paymentMethod" type="radio" class="form-check-input" required />
                              <label class="form-check-label" for="paypal">PayPal</label>
                          </div>
                        </div>

                        <div class="row gy-3">
                          <div class="col-md-6">
                            <label for="cc-name" class="form-label">Nome sulla Carta</label>
                            <input type="text" class="form-control" id="cc-name" placeholder="" required />
                              <small class="text-muted">Full name as displayed on card</small>
                              <div class="invalid-feedback">
                                Name on card is required
                              </div>
                          </div>

                          <div class="col-md-6">
                            <label for="cc-number" class="form-label">Numero della carta di credito</label>
                            <input type="text" class="form-control" id="cc-number" placeholder="" required />
                              <div class="invalid-feedback">
                                Credit card number is required
                              </div>
                          </div>

                          <div class="col-md-3">
                            <label for="cc-expiration" class="form-label">Data di Scadenza</label>
                            <input type="text" class="form-control" id="cc-expiration" placeholder="" required />
                              <div class="invalid-feedback">
                                Expiration date required
                              </div>
                          </div>

                          <div class="col-md-3">
                            <label for="cc-cvv" class="form-label">CVV</label>
                            <input type="text" class="form-control" id="cc-cvv" placeholder="" required />
                              <div class="invalid-feedback">
                                Security code required
                              </div>
                          </div>
                        </div>

                        {/* <hr class="my-4"></hr>

                        <button class="w-100 btn btn-primary btn-lg" type="submit">Conferma</button> */}
                      </form>
                    </div>
                  </div>

                </main>
              </div>
              
            </div>
            <div class="modal-footer">
              <button class="btn btn-primary"
                // data-bs-target="#exampleModalToggle2" data-bs-toggle="modal"
                onClick={handlePrenotaSubmit}>Conferma</button>
            </div>
          </div>
        </div>
      </div>
      <div class="modal fade" id="exampleModalToggle2" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalToggleLabel2">Conferma</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <p>Prenotazione andata a buon fine.</p>
              <p>Le arrivera' una mail di conferma al piu' presto.</p>
            </div>
            <div class="modal-footer">
              {/* onClick navigate to stabilimenti */}
              <button class="btn btn-primary" data-bs-dismiss="modal">Ok</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function DrawGrid({ seat, available, reserved, onClickData }) {
  const onClickSeat = (seat) => {
    onClickData(seat);
  }

  return (
    <div className="mapContainer">
      <div className="grid-container">
        {seat.map(s =>
          <div
            className={
              s.booked ? 'booked' :
                reserved.findIndex((element) => element.id === s.id) > -1 ? 'reserved' : 'available'
              // () => {
              //   // return reserved.findIndex((element) => element.id === row.id) > -1? 'reserved': 'available';
              //   if (row.booked) {
              //     return 'booked';
              //   }
              //   else {
              //     return reserved.findIndex((element) => element.id === row.id) > -1? 'reserved': 'available';
              //   }
              // }
              // reserved.findIndex((element) => element.id === row.id) > -1? 'reserved': 'available'
            }
            key={s.id} onClick={e => onClickSeat(s)}>
            {s.id}
          </div>
        )}
      </div>

      {/* <AvailableList available={available} /> */}
      <ReservedList reserved={reserved} />
    </div>
  )

}

function AvailableList({ available }) {
  const seatCount = available.length;

  return (
    <div className="left">
      <h4>Available Seats: ({seatCount === 0 ? 'No seats available' : seatCount})</h4>
      <ul>
        {available.map(res => <li key={res.id} >{res.id}</li>)}
      </ul>
    </div>
  )
}

function ReservedList({ reserved }) {
  return (
    <div className="right">
      <h4>Stai prenotando: ({reserved.length})</h4>
      <ul>
        {reserved.map(res => <li key={res.id} >{res.id} - €: {res.price}</li>)}
      </ul>
    </div>
  )
}

function Cart({ reserved }) {
  let initialValue = 0;
  let totalPrice = reserved.reduce(
    (previousValue, currentValue) => previousValue + currentValue.price,
    initialValue
  );

  let total = Number.parseFloat(totalPrice).toFixed(2);
  
  return (
    <>
      <h4 class="d-flex justify-content-between align-items-center mb-3">
        <span class="text-primary">Carrello</span>
        <span class="badge bg-primary rounded-pill">{reserved.length}</span>
      </h4>
      <ul class="list-group mb-3">
        {reserved.map(res =>
          <li class="list-group-item d-flex justify-content-between lh-sm"
            key={res.id} >
            <div>
              <h6 class="my-0">Posto {res.id}</h6>
              <small class="text-muted">Ombrellone con due lettini</small>
            </div>
            <span class="text-muted">€{res.price}</span>
          </li>)}

        <li class="list-group-item d-flex justify-content-between bg-light">
          <div class="text-success">
            <h6 class="my-0">Codice Promo</h6>
            <small>EXAMPLECODE</small>
          </div>
          <span class="text-success">−€5</span>
        </li>
        <li class="list-group-item d-flex justify-content-between">
          <span>Total (EUR)</span>
          <strong>€{total}</strong>
        </li>
      </ul>

      {/* <div className="right">
        <h4>Stai prenotando: ({reserved.length})</h4>
        <ul>
          {reserved.map(res => <li key={res.id} >{res.id} - €: {res.price}</li>)}
        </ul>
      </div> */}
    </>
  )
}

function formatDate(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;

  return [day, month, year].join('/');
}