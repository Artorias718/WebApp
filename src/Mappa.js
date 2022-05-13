import React, { useState, useEffect } from 'react';
import {
  useParams,
  useNavigate,
  useLocation,
} from "react-router-dom";
import axios from 'axios';
import './mappa.css';

export default function Mappa() {
  let navigate = useNavigate();
  let location = useLocation();
  let params = useParams();
  let stabilimentoId = parseInt(params.stabilimentoId, 10);

  const [seat, setSeat] = useState([]);
  const [seatAvailable, setSeatAvailable] = useState([]);
  const [seatReserved, setSeatReserved] = useState([]);

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
  }, [stabilimentoId]);

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
  function handleSubmit(e) {
    e.preventDefault();
    console.log('You clicked submit.');
    console.log('stabilimentoID: ' + stabilimentoId);
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
      axios.post('http://localhost:7500/api/v1/prenotazioni/create', {
        "stabilimentoID": stabilimentoId,
        "listaPostiPrenotati": reservedIds,
        "totalPrice": totalPrice
      })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
    }

  }

  return (
    <main>
      <h1>Seat Reservation System</h1>
      <DrawGrid
        seat={seat}
        available={seatAvailable}
        reserved={seatReserved}
        onClickData={onClickData.bind(this)}
      />
      <p style={{ float: "right" }}>
        <button type='submit' style={{ margin: "1rem" }}
          onClick={handleSubmit
            // () => {
            // deleteInvoice(invoice.number);
            // navigate("/invoices" + location.search);
            // }
          }
        >
          Conferma
        </button>
        <button style={{ margin: "1rem" }}
          onClick={() => {
            // deleteInvoice(invoice.number);
            navigate("/stabilimenti" + location.search);
          }}
        >
          Back
        </button>
      </p>
    </main>
  )
}

function DrawGrid({ seat, available, reserved, onClickData }) {
  const onClickSeat = (seat) => {
    onClickData(seat);
  }

  return (
    <div className="container">
      <h2></h2>
      <table className="grid">
        <tbody>
          <tr>
            {seat.map(row =>
              <td
                className={
                  row.booked ? 'booked' :
                    reserved.findIndex((element) => element.id === row.id) > -1 ? 'reserved' : 'available'
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
                key={row.id} onClick={e => onClickSeat(row)}><a href="#">{row.id}</a></td>)}
          </tr>
        </tbody>
      </table>

      <AvailableList available={available} />
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
      <h4>Reserved Seats: ({reserved.length})</h4>
      <ul>
        {reserved.map(res => <li key={res.id} >{res.id} - €: {res.price}</li>)}
      </ul>
    </div>
  )
}
