import React, { useState, useEffect, useRef } from "react";

const API = process.env.REACT_APP_API;

export const SearchTrips = () => {
  const [driver, setDriver] = useState("");
  const [date, setDate] = useState("");
  const [seats, setSeats] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  
  const [filtering, setFiltering] = useState(false);
  const [id, setId] = useState("");

  const nameInput = useRef(null);

  let [trips, setTrips] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (filtering){
      if (driver){
        getTripsByDriver(driver);
      }else{
        if (date){
          getTripsByDate(date);
        }else{
          if (seats){
            getTripsByMinimumSeats(seats);
          }else{
            if (origin && !destination){
              getTripsByOrigin(origin);
            }else if (!origin && destination){
              getTripsByDestination(destination);
            }else if (origin && destination){
              getTripsByOriginAndDestination(origin,destination);
            }else{
              getReset();
            }
          }
        } 
      }
    }else{
        getTrips();
    }

    setDriver("");
    setDate("");
    setOrigin("");
    setDestination("");
    setSeats("");
    nameInput.current.focus();  
  };

    const getTrips = async () => {
    const res = await fetch(`${API}/trip`);
    const data = await res.json();
    setTrips(data);
  };
  
  const getTripsByDriver = async (id) => {
    const res = await fetch(`${API}/trip/driver/${id}`);
    const data = await res.json();
    setTrips(data);
  };

  const getTripsByDate = async (date) => {
    const res = await fetch(`${API}/trip/date/${date}`);
    const data = await res.json();
    setTrips(data);
  };

  const getTripsByMinimumSeats = async (seats) => {
    const res = await fetch(`${API}/trip/minseats/${seats}`);
    const data = await res.json();
    setTrips(data);
  };

  const getTripsByOrigin = async (origin) => {
    const res = await fetch(`${API}/trip/origin/${origin}`);
    const data = await res.json();
    setTrips(data);
  };

  const getTripsByDestination = async (destination) => {
    const res = await fetch(`${API}/trip/destination/${destination}`);
    const data = await res.json();
    setTrips(data);
  };

  const getTripsByOriginAndDestination = async (origin,destination) => {
    const res = await fetch(`${API}/trip/origin_destination/${origin}/${destination}`);
    const data = await res.json();
    setTrips(data);
  };

  const getReset = async () => {
    setFiltering(false);
    getTrips();
  }

  useEffect(() => {
    getTrips("");
  }, []);

  
  if (filtering){
  return (
    <div className="row">
      <div className="row">
        <button
          className="btn btn-primary btn-block"
          onClick={(e) => getReset()}
        >
        Volver
        </button>
      <div className="col md-4">
        <form onSubmit={handleSubmit} className="card card-body">
          <div className="form-group">
            <input
              type="text"
              onChange={(e) => setDriver(e.target.value)}
              value={driver}
              className="form-control"
              placeholder="Conductor"
              autoFocus
            />
            <br />
            <input
              type="date"
              onChange={(e) => setDate(e.target.value)}
              value={date}
              className="form-control"
              placeholder="Fecha"
            />
            <br />
            <input
              type="text"
              onChange={(e) => setOrigin(e.target.value)}
              value={origin}
              className="form-control"
              placeholder="Origen"
            />
            <br />
            <input
              type="text"
              onChange={(e) => setDestination(e.target.value)}
              value={destination}
              className="form-control"
              placeholder="Destino"
            />
            <br />
            <input
              type="number"
              onChange={(e) => setSeats(e.target.value)}
              value={seats}
              className="form-control"
              placeholder="Asientos"
            />
            <br />
          </div>
          <button className="btn btn-primary btn-block">
            Buscar
            </button>
        </form>
      </div>
      </div>
      <div className="col-md-6">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Conductor</th>
              <th>Fecha</th>
              <th>Origen</th>
              <th>Origen (Lat)</th>
              <th>Origen (Lon)</th>
              <th>Destino</th>
              <th>Destino (Lat)</th>
              <th>Destino (Lon)</th>
              <th>Asientos</th>
            </tr>
          </thead>
          <tbody>
            {trips.map((trip) => (
              <tr key={trip._id}>
                <td>{trip.driver}</td>
                <td>{trip.date}</td>
                <td>{trip.origin}</td>
                <td>{trip.originLatitude}</td>
                <td>{trip.originLongitude}</td>
                <td>{trip.destination}</td>
                <td>{trip.destinationLatitude}</td>
                <td>{trip.destinationLongitude}</td>
                <td>{trip.seats}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  }else{
    return (
      <div className="row">
        <div className="row">
        <button
          className="btn btn-primary btn-block"
          onClick={(e) => setFiltering(true)}
        >
        Filtrar
        </button>
        <div className="col-md-6">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Conductor</th>
                <th>Fecha</th>
                <th>Origen</th>
                <th>Origen (Lat)</th>
                <th>Origen (Lon)</th>
                <th>Destino</th>
                <th>Destino (Lat)</th>
                <th>Destino (Lon)</th>
                <th>Asientos</th>
              </tr>
            </thead>
            <tbody>
              {trips.map((trip) => (
                <tr key={trip._id}>
                  <td>{trip.driver}</td>
                  <td>{trip.date}</td>
                  <td>{trip.origin}</td>
                  <td>{trip.originLatitude}</td>
                  <td>{trip.originLongitude}</td>
                  <td>{trip.destination}</td>
                  <td>{trip.destinationLatitude}</td>
                  <td>{trip.destinationLongitude}</td>
                  <td>{trip.seats}</td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    );
  }
};
