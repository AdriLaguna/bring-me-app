import React, { useState } from "react";

import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../App.css";

import Markers from './Markers'

const API = process.env.REACT_APP_API;

const MapView = () => {
    const {gasolineras} = fetch(`${API}/gasolineras-biodiesel`)
  return (
    <MapContainer center={{ lat: "40.1498916", lng: "-4.8803695" }} zoom={6}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      ></TileLayer>
      <Markers places={gasolineras}></Markers>
    </MapContainer>
  );
};

export default MapView;
