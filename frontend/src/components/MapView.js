import React, { useEffect, useState } from "react";

import { MapContainer, Marker, Popup, TileLayer, Tooltip } from "react-leaflet";
import { Icon } from "leaflet";
import useSwr from "swr";
import "leaflet/dist/leaflet.css";
import "../App.css";

import Markers from './Markers'

const API = process.env.REACT_APP_API;

const fetcher = (...args) => fetch(...args).then(response => response.json());

const icon = new Icon({
  iconUrl: "/biofuel-svgrepo-com.svg",
  iconSize: [25, 25]
});

const MapView = () => {

  const url = `${API}/gasolineras-biodiesel`
  const {data, error} = useSwr(url, fetcher);
  const gasolineras = data && !error ? data : [];
  const [activeGasolinera, setActiveGasolinera] = useState(null);
  //const {gasolineras} = fetch(`${API}/gasolineras-biodiesel`)
  
  return (
    <MapContainer center={{ lat: "36.7202" , lng: "-4.4203"  }} zoom={8}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      ></TileLayer>
      
      {gasolineras.map(gasolinera => (
        <Marker key={gasolinera.IDEESS}
                position={[gasolinera['Latitud'].replace(",","."), gasolinera['Longitud (WGS84)'].replace(",",".")]}
                icon={icon}
                
        >
           <Tooltip direction='top' opacity={1} >

            <p> Estación: {gasolinera.IDEESS} ({gasolinera.Rótulo}) </p>
            <p> {gasolinera.Localidad} ({gasolinera.Provincia}) </p>
            <p> Precio Biodiesel: {gasolinera['Precio Biodiesel']} </p>
            
          </Tooltip>

        </Marker>  
      ))}

     </MapContainer>
  );
};

export default MapView;
