import React, { useState, useEffect } from 'react';
import {
  useParams,
  useNavigate,
  useLocation,
} from "react-router-dom";
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css'
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
  const [mydate, setMydate] = useState(new Date(sDate));

  let stabName = '';

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
        let selectedDate = formatDate(mydate);
        console.log(selectedDate);
        const result = await axios('http://localhost:8080/api/v1/stabilimenti/' + stabilimentoId + '/lista_Posti/' + selectedDate);

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
  }, [stabilimentoId, mydate]);// in teoria se cambio uno dei due valori -> esegue useEffect

  // metodo che permette di aggiornare i posti scelti dall'utente
  const onClickData = (seat) => {
    if (seat.isBooked) {
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
    
    // recupero i dati dell'utente
    const isAuth = localStorage.getItem('isAuth');
    console.log('isAuth: ' + isAuth);
    if (isAuth) {
      const userEmail = localStorage.getItem('email');
      console.log('user email: ' + userEmail);
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
      console.log(mydate);

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
          "date": formatDate(mydate),
          "userEmail": userEmail
        })
          .then(function (response) {
            console.log(response);
            alert("Prenotazione andata a buon fine");
            sessionStorage.setItem('selectedDate', new Date());
            navigate("/stabilimenti" + location.search);
          })
          .catch(function (error) {
            console.log(error);
            alert(error);
          });
      }
    }
    else {
      alert('Realizzare il login per poter prenotare!');
      navigate('/login');
    }
  }

  function handleDateSelection(date) {
    console.log('handleDateSelection: ' + date)
    setMydate(date);
    sessionStorage.setItem('selectedDate', date);
  }

  stabName = stabilimento.name;

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
                    <label htmlFor="colFormLabel" class="col-sm-4 col-form-label">Data</label>
                    <div class="col-md-4">
                      <div>
                        <DatePicker className='form-control'
                          onChange={handleDateSelection}
                          value={mydate}
                          format={"dd/MM/yyyy"}
                          minDate={new Date()} />
                      </div>
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
                      navigate("/stabilimenti" + location.search);
                    }}
                  >Back</button>
                  <a class="btn btn-primary" data-bs-toggle="modal" href="#checkoutModalToggle" role="button">Prenota</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div class="modal fade" id="checkoutModalToggle" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabIndex="-1">
        <div class="modal-dialog modal-xl modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalToggleLabel">Conferma Prenotazione</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="container">
                <main>
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
                      <h4 class="mb-4">Riepilogo</h4>
                      <div class="row gy-3">
                        <div class="row mb-3">
                          <label htmlFor="colFormLabel" class="col-sm-2 col-form-label">Data:</label>
                          <div class="col-md-3">
                            <input type="text" readOnly class="form-control-plaintext" id="riepData" value={formatDate(mydate)} />
                          </div>
                          <div>
                            <Calendar value={new Date(mydate)}/>
                          </div>
                        </div>

                        <div class="row">
                          {/* la col-lg-2 fa si che si sovrappongono le scritte in alcune misure di finestra */}
                          <label htmlFor="colFormLabel" class="col-sm-3 col-md-3 col-lg-2 col-form-label">Stabilimento:</label>
                          <div class="col-sm-10">
                            <input type="text" readOnly class="form-control-plaintext" id="riepStab" value={stabName} />
                          </div>
                        </div>
                      </div>

                      <hr class="my-4"></hr>

                      <h4 class="mb-3">Dati per la Fatturazione</h4>
                      <form class="needs-validation" noValidate>
                        <div class="row g-3">
                          <div class="col-sm-6">
                            <label htmlFor="firstName" class="form-label">Nome</label>
                            <input type="text" class="form-control" id="firstName" placeholder="" required />
                              <div class="invalid-feedback">
                                Valid first name is required.
                              </div>
                          </div>

                          <div class="col-sm-6">
                            <label htmlFor="lastName" class="form-label">Cognome</label>
                            <input type="text" class="form-control" id="lastName" placeholder="" required />
                              <div class="invalid-feedback">
                                Valid last name is required.
                              </div>
                          </div>

                          <div class="col-12">
                            <label htmlFor="username" class="form-label">Username</label>
                            <div class="input-group has-validation">
                              <span class="input-group-text">@</span>
                              <input type="text" class="form-control" id="username" placeholder="Username" required />
                                <div class="invalid-feedback">
                                  Your username is required.
                                </div>
                            </div>
                          </div>

                          <div class="col-12">
                            <label htmlFor="email" class="form-label">Email <span class="text-muted">(Optional)</span></label>
                            <input type="email" class="form-control" id="email" placeholder="you@example.com" />
                              <div class="invalid-feedback">
                                Please enter a valid email address for shipping updates.
                              </div>
                          </div>

                          <div class="col-12">
                            <label htmlFor="address" class="form-label">Indirizzo</label>
                            <input type="text" class="form-control" id="address" placeholder="1234 Main St" required />
                              <div class="invalid-feedback">
                                Please enter your shipping address.
                              </div>
                          </div>

                          <div class="col-12">
                            <label htmlFor="address2" class="form-label">Indirizzo 2 <span class="text-muted">(Optional)</span></label>
                            <input type="text" class="form-control" id="address2" placeholder="Apartment or suite" />
                          </div>

                          <div class="col-md-5">
                            <label htmlFor="country" class="form-label">Nazione</label>
                            <select class="form-select" id="country" required>
                              <option value="">Scegli...</option>
                              <option>Italia</option>
                            </select>
                            <div class="invalid-feedback">
                              Please select a valid country.
                            </div>
                          </div>

                          <div class="col-md-4">
                            <label htmlFor="state" class="form-label">Provincia</label>
                            <select class="form-select" id="state" required>
                              <option value="">Scegli...</option>
                              <option>Cuneo</option>
                            </select>
                            <div class="invalid-feedback">
                              Please provide a valid state.
                            </div>
                          </div>

                          <div class="col-md-3">
                            <label htmlFor="zip" class="form-label">CAP</label>
                            <input type="text" class="form-control" id="zip" placeholder="" required />
                              <div class="invalid-feedback">
                                Zip code required.
                              </div>
                          </div>
                        </div>

                        <hr class="my-4"></hr>

                        <div class="form-check">
                          <input type="checkbox" class="form-check-input" id="same-address" />
                            <label class="form-check-label" htmlFor="same-address">Shipping address is the same as my billing address</label>
                        </div>

                        <div class="form-check">
                          <input type="checkbox" class="form-check-input" id="save-info" />
                            <label class="form-check-label" htmlFor="save-info">Save this information for next time</label>
                        </div>

                        <hr class="my-4"></hr>

                        <h4 class="mb-3">Modalita' di Pagamento</h4>

                        <div class="my-3">
                          <div class="form-check">
                            <input id="credit" name="paymentMethod" type="radio" class="form-check-input" defaultChecked required />
                              <label class="form-check-label" htmlFor="credit">Carta di Credito</label>
                          </div>
                          <div class="form-check">
                            <input id="debit" name="paymentMethod" type="radio" class="form-check-input" required />
                              <label class="form-check-label" htmlFor="debit">Satispay</label>
                          </div>
                          <div class="form-check">
                            <input id="paypal" name="paymentMethod" type="radio" class="form-check-input" required />
                              <label class="form-check-label" htmlFor="paypal">PayPal</label>
                          </div>
                        </div>

                        <div class="row gy-3">
                          <div class="col-md-6">
                            <label htmlFor="cc-name" class="form-label">Nome sulla Carta</label>
                            <input type="text" class="form-control" id="cc-name" placeholder="" required />
                              <small class="text-muted">Full name as displayed on card</small>
                              <div class="invalid-feedback">
                                Name on card is required
                              </div>
                          </div>

                          <div class="col-md-6">
                            <label htmlFor="cc-number" class="form-label">Numero della carta di credito</label>
                            <input type="text" class="form-control" id="cc-number" placeholder="" required />
                              <div class="invalid-feedback">
                                Credit card number is required
                              </div>
                          </div>

                          <div class="col-md-3">
                            <label htmlFor="cc-expiration" class="form-label">Data di Scadenza</label>
                            <input type="text" class="form-control" id="cc-expiration" placeholder="" required />
                              <div class="invalid-feedback">
                                Expiration date required
                              </div>
                          </div>

                          <div class="col-md-3">
                            <label htmlFor="cc-cvv" class="form-label">CVV</label>
                            <input type="text" class="form-control" id="cc-cvv" placeholder="" required />
                              <div class="invalid-feedback">
                                Security code required
                              </div>
                          </div>
                        </div>

                      </form>
                    </div>
                  </div>

                </main>
              </div>
              
            </div>
            <div class="modal-footer">
              <button class="btn btn-primary" data-bs-dismiss="modal"
                // data-bs-target="#exampleModalToggle2" data-bs-toggle="modal"
                onClick={handlePrenotaSubmit}>Conferma</button>
            </div>
          </div>
        </div>
      </div>
      <div class="modal fade" id="exampleModalToggle2" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabIndex="-1">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalToggleLabel2">Conferma</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              {/* qua se uso il sistema degli modal devo cambiare il messaggio del secondo modal
              in modo che mi faccia vedere l'esito della prenotazione o avere due modal e mostrare quello
              secondo l'esito */}
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
              s.isBooked ? 'booked' :
                reserved.findIndex((element) => element.id === s.id) > -1 ? 'reserved' : 'available'
              // si capirebbe meglio se fossi cosi ma non riesco a far funzionare
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

      {/* <AvailableList available={available} /> non faccio vedere la lista di posti disponibili */}
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
  // posso calcolare il totale anche qua
  let initialValue = 0;
  let totalPrice = reserved.reduce(
    (previousValue, currentValue) => previousValue + currentValue.price,
    initialValue
  );

  let total = Number.parseFloat(totalPrice).toFixed(2);

  return (
    <div className="row justify-content-center">
      <div className="col-8">
        <h4 className="p-4">Stai prenotando: ({reserved.length})</h4>
        <ul class="list-group mb-3">
          {reserved.map(res =>
            <li class="list-group-item d-flex justify-content-between lh-sm mb-2"
              key={res.id} >
              <span>Posto {res.id}</span>
              <strong>€{res.price}</strong>
            </li>
            )}
        </ul>

        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
          <span>Totale (EUR):</span>
          <strong>€{total}</strong>
        </div>

      </div>

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

  return [year, month, day].join('-');
}