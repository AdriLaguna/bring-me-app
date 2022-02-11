import React, { useEffect, useState} from "react";

import { MapContainer, Marker, Popup, TileLayer, Tooltip } from "react-leaflet";
import { Icon } from "leaflet";
import useSwr from "swr";
import "leaflet/dist/leaflet.css";
import "../App.css";

import Markers from './Markers'

const API = process.env.REACT_APP_API;

const fetcher = (...args) => fetch(...args).then(response => response.json());

const icon = new Icon({
  iconUrl: "/gasolinera.png",
  iconSize: [25, 25]
});

const icon2 = new Icon({
  iconUrl: "/biofuel-svgrepo-com.svg",
  iconSize: [25, 25]
});

const MapView = () => {

  const [ccaa, setCcaa] = useState("01");
  const [lat, setLat] = useState("40.128289")
  const [lng, setLng] = useState("-3.720385")
  const [zoom, setZoom] = useState("6.5")
  let [gasolineras, setGasolineras] = useState([]);

  const getGasolinerasByCcaa = async (ccaa) => {
    const res = await fetch(`${API}/precio-carburante/${ccaa}`);
    const data = await res.json();
    setGasolineras(data);

    //const {gasolineras} = fetch(`${API}/gasolineras-biodiesel`)
  };
  
  const url = `${API}/gasolineras-biodiesel`
  const {data, error} = useSwr(url, fetcher);
  const gasolinerasbio = data && !error ? data : [];
  const [activeGasolinera, setActiveGasolinera] = useState(null);
  //const {gasolineras} = fetch(`${API}/gasolineras-biodiesel`)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCcaa(ccaa)
    if(ccaa!="00"){
      getGasolinerasByCcaa(ccaa)
    }else{
      setGasolineras([])
    }
  }


  return (
    <div className="row">
      <form onSubmit={handleSubmit} target="_blank">
      Gasolineras de venta al público por Comunidad Autónoma: 
      <select name="ccaa" onChange={(e) => setCcaa(e.target.value)}>
        <option value="00">-</option>
        <option value="01">Andalucía</option>
        <option value="02">Aragón</option>
        <option value="03">Asturias</option>
        <option value="04">Islas Baleares</option>
        <option value="05">Islas Canarias</option>
        <option value="06">Cantabria</option>
        <option value="07">Castilla La Mancha</option>
        <option value="08">Castilla y León</option>
        <option value="09">Cataluña</option>
        <option value="10">Comunidad Valenciana</option>
        <option value="11">Extremadura</option>
        <option value="12">Galicia</option>
        <option value="13">Madrid</option>
        <option value="14">Murcia</option>
        <option value="15">Navarra</option>
        <option value="16">País Vasco</option>
        <option value="17">La Rioja</option>
        <option value="18">Ceuta</option>
        <option value="19">Melilla</option>
    </select>
      <input type="submit" value="Filtrar"/>
      </form>
    <div>
    <MapContainer center={{ lat: lat , lng: lng  }} zoom={zoom}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      ></TileLayer>
      
      {gasolinerasbio.map(gasolinera => (
        <Marker key={gasolinera.IDEESS}
                position={[gasolinera['Latitud'].replace(",","."), gasolinera['Longitud (WGS84)'].replace(",",".")]}
                icon={icon2}
                
        >
           <Tooltip direction='top' opacity={1} >

            <p> Estación: {gasolinera.IDEESS} ({gasolinera.Rótulo}) </p>
            <p> {gasolinera.Localidad} ({gasolinera.Provincia}) </p>
            <p> Precio Biodiesel: {gasolinera['Precio Biodiesel']} </p>
            
          </Tooltip>

        </Marker>  
      ))}

      {gasolineras.map(gasolinera => (
        <Marker key={gasolinera.IDEESS}
                position={[gasolinera['Latitud'].replace(",","."), gasolinera['Longitud (WGS84)'].replace(",",".")]}
                icon={icon}
                
        >
           <Tooltip direction='top' opacity={1} >

            <p> Estación: {gasolinera.IDEESS} ({gasolinera.Rótulo}) </p>
            <p> {gasolinera.Localidad} ({gasolinera.Provincia}) </p>
            <p> Precio Gasoleo A: {gasolinera['Precio Gasoleo A']} </p>
            <p> Precio Gasolina 95: {gasolinera['Precio Gasolina 95 E5']} </p>
            
          </Tooltip>

        </Marker>  
      ))}

     </MapContainer>
     </div>
     </div>
  );
};

export default MapView;
