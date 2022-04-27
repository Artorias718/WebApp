import React, { useState, useEffect } from 'react';
import {
  useParams,
  useNavigate,
  useLocation,
} from "react-router-dom";
import axios from 'axios';
// import 'bootstrap/dist/css/bootstrap.css';
import './seat.css';

export default function App() {
  let navigate = useNavigate();
  let location = useLocation();
  let params = useParams();
  let invoice = parseInt(params.invoiceId, 10);

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
          const result = await axios('http://localhost:8080/api/v1/stabilimenti/' + invoice + '/lista_Posti');

          setSeat(result.data);
          setSeatAvailable(result.data.filter(s => s.booked === false));
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
  }, [invoice]);
    
  const onClickData = (seat) => {
    if (seat.booked) {
      alert('Posto: ' + seat.id + ' non disponibile!');
    }
    else {
      if(seatReserved.findIndex((element) => element.id === seat.id) > -1 ) {
        setSeatAvailable(seatAvailable.concat(seat));
        setSeatReserved(seatReserved.filter(res => res.id !== seat.id));  
      } else {
        setSeatReserved(seatReserved.concat(seat));
        setSeatAvailable(seatAvailable.filter(res => res.id !== seat.id));
      }
    }
  };

  return (
    <div>
      <h1>Seat Reservation System</h1>
      <DrawGrid 
        seat = { seat }
        available = { seatAvailable }
        reserved = { seatReserved }
        onClickData = { onClickData.bind(this) }
      />
      <p style={{ float: "right" }}>
      <button style={{ margin: "1rem" }}
          // onClick={() => {
          //   // deleteInvoice(invoice.number);
          //   navigate("/invoices" + location.search);
          // }}
        >
          Conferma
        </button>
        <button style={{ margin: "1rem" }}
          onClick={() => {
            // deleteInvoice(invoice.number);
            navigate("/invoices" + location.search);
          }}
        >
          Back
        </button>
      </p>
    </div>
  )
}
  
function DrawGrid({seat, available, reserved, onClickData}) {
  const onClickSeat = (seat) => {
    onClickData(seat);  
  }
  
  return (
    <div className="container">
      <h2></h2>
      <table className="grid">
        <tbody>
            <tr>
              { seat.map( row =>
                <td
                  className={
                    row.booked ? 'booked' : 
                      reserved.findIndex((element) => element.id === row.id) > -1? 'reserved': 'available'
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
                  key={row.id} onClick = {e => onClickSeat(row)}>{row.id} </td>) }
            </tr>
        </tbody>
      </table>
      
      <AvailableList available = { available } />
      <ReservedList reserved = { reserved } />
    </div>
  )
 
}

function AvailableList({ available }) {
  const seatCount = available.length;

  return(
    <div className="left">
      <h4>Available Seats: ({seatCount === 0? 'No seats available' : seatCount})</h4>
      <ul>
        { available.map( res => <li key={res.id} >{res.id}</li> ) }
      </ul>
    </div>
  )
}

function ReservedList({ reserved }) {
  return(
    <div className="right">
      <h4>Reserved Seats: ({reserved.length})</h4>
      <ul>
        { reserved.map(res => <li key={res.id} >{res.id}</li>) }
      </ul>
    </div>
  )
}
