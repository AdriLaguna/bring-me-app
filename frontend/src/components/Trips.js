import React, { useState, useEffect, useRef } from "react";

const API = process.env.REACT_APP_API;

export const Trips = () => {
  const [driver, setDriver] = useState("");
  const [date, setDate] = useState("");
  const [origin, setOrigin] = useState("");
  const [originLatitude, setOriginLatitude] = useState("");
  const [originLongitude, setOriginLongitude] = useState("");
  const [destination, setDestination] = useState("");
  const [destinationLatitude, setDestinationLatitude] = useState("");
  const [destinationLongitude, setDestinationLongitude] = useState("");
  const [seats, setSeats] = useState("");
  
  const [editing, setEditing] = useState(false);
  const [id, setId] = useState("");

  const nameInput = useRef(null);

  let [trips, setTrips] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editing) {
      const res = await fetch(`${API}/trip`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          driver,
          date,
          origin,
          originLatitude,
          originLongitude,
          destination,
          destinationLatitude,
          destinationLongitude,
          seats
        }),
      });
      const data = await res.json();
      console.log(data);
    } else {
      const res = await fetch(`${API}/trip/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          driver,
          date,
          origin,
          originLatitude,
          originLongitude,
          destination,
          destinationLatitude,
          destinationLongitude,
          seats
        }),
      });
      const data = await res.json();
      console.log(data);
      setEditing(false);
      setId("");
    }
    await getTrips();

    setDriver("");
    setDate("");
    setOrigin("");
    setOriginLatitude("");
    setOriginLongitude("");
    setDestination("");
    setDestinationLatitude("");
    setDestinationLongitude("");
    setSeats("");
    nameInput.current.focus();  
  };

  const getTrips = async () => {
    const res = await fetch(`${API}/trip`);
    const data = await res.json();
    setTrips(data);
  };

  const deleteTrip = async (id) => {
    const tripResponse = window.confirm("Are you sure you want to delete it?");
    if (tripResponse) {
      const res = await fetch(`${API}/trip/${id._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      console.log(data);
      await getTrips();
    }
  };

  const editTrip = async (id) => {
    const res = await fetch(`${API}/trip/${id}`);
    const data = await res.json();

    setEditing(true);
    setId(id);

    // Reset
    setDriver(data.driver);
    setDate(data.date);
    setOrigin(data.origin);
    setOriginLatitude(data.originLatitude);
    setOriginLongitude(data.originLongitude);
    setDestination(data.destination);
    setDestinationLatitude(data.destinationLatitude);
    setDestinationLongitude(data.destinationLongitude);
    setSeats(data.seats);
    nameInput.current.focus();
  };

  useEffect(() => {
    getTrips();
  }, []);

  return (
    <div className="row">
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
              type="number"
              onChange={(e) => setOriginLatitude(e.target.value)}
              value={originLatitude}
              className="form-control"
              placeholder="Origen (Latitud)"
            />
            <br />
            <input
              type="number"
              onChange={(e) => setOriginLongitude(e.target.value)}
              value={originLongitude}
              className="form-control"
              placeholder="Origen (Longitud)"
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
              onChange={(e) => setDestinationLatitude(e.target.value)}
              value={destinationLatitude}
              className="form-control"
              placeholder="Destino (Latitud)"
            />
            <br />
            <input
              type="number"
              onChange={(e) => setDestinationLongitude(e.target.value)}
              value={destinationLongitude}
              className="form-control"
              placeholder="Destino (Longitud)"
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
            {editing ? "Actualizar Viaje" : "Crear Viaje"}
            </button>
        </form>
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
                <td>
                  <button
                    className="btn btn-secondary btn-sm btn-block"
                    onClick={(e) => editTrip(trip._id)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger btn-sm btn-block"
                    onClick={(e) => deleteTrip(trip._id)}
                  >
                    Borrar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
