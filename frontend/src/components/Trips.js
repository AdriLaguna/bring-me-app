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

  const [imageUrl, setImageUrl] = useState("");

  const cloud_name = "themanofsteel1976";
  const upload_preset = "v2gj9sd6"; 

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
          seats,
          imageUrl
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
          seats,
          imageUrl
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
    setImageUrl("");
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
      const res = await fetch(`${API}/trip/${id}`, {
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
    setImageUrl(data.imageUrl);
    nameInput.current.focus();
  };

  const handleClick = () => {
    const { files } = document.querySelector(".app_uploadInput");
    const formData = new FormData();
  
    formData.append("file", files[0]);
    formData.append("upload_preset", upload_preset);
    const options = {
      method: "POST",
      body: formData,
    };
    console.log(formData);
    return fetch(
      `https://api.Cloudinary.com/v1_1/${cloud_name}/upload`,
      options
    )
      .then((res) => res.json())
      .then((res) => {
      setImageUrl(res.secure_url);
    })
    .catch((err) => console.log(err));
};

  useEffect(() => {
    getTrips();
  }, []);

  return (
    <div className="row">
      <div className="col-md-4">
      Foto del veh??culo: &nbsp;
            <input type="file" className="app_uploadInput"/>
        <button className="app_uploadButton" onClick={handleClick}>Subir</button>
        &nbsp;<img src={imageUrl} width="50" alt="" />
        <br />
        <form onSubmit={handleSubmit} className="card card-body">
          <div className="form-group">
          <input
              type="hidden"
              onChange={(e) => setImageUrl(e.target.value)}
              value={imageUrl}
              className="form-control"
              placeholder="URL Imagen"
            />
            <br />
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
      <div className="col-md-8">
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
              <th>Veh??culo</th>
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
                <td><img src={trip.imageUrl} width="100" alt="" /></td>
                <td>
                  <button
                    className="btn btn-secondary btn-sm btn-block"
                    onClick={(e) => editTrip(trip._id? trip._id.$oid: null)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger btn-sm btn-block"
                    onClick={(e) => deleteTrip(trip._id? trip._id.$oid: null)}
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
