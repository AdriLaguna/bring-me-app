import React, { useState } from "react";
import { Marker } from "react-leaflet";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import { Icon } from "leaflet";

const API = process.env.REACT_APP_API;

// let [markers, setMarkers] = useState([]);

const Markers = (props) => {
  const { places } = props;
  const markers = places.map((place, i) => (
    <Marker
      key={i}
      position={{ lat: place.Latitud, lng: "-4.8803695" }}
      icon={
        new Icon({
          iconUrl: markerIconPng,
          iconSize: [25, 41],
          iconAnchor: [12, 41],
        })
      }
    />
  ));
  return markers;
};

// const getMarkers = async () => {
//   const res = await fetch(`${API}/gasolineras-biodiesel`);
//   const data = await res.json();
//   setMarkers(data);
// };

export default Markers;
