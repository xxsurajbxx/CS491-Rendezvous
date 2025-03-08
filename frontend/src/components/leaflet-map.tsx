/**
 * Events map component that shows the different events within the city of Newark.
 */

"use client"

//leaflet imports here
import "leaflet/dist/leaflet.css";
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import "leaflet-defaulticon-compatibility";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { Icon } from "leaflet";
import markerIconPng from "leaflet/dist/images/marker-icon.png"

//Defines a marked position on the leaflet map including name of location, coordinates of location, and a popup description that describes that location/event.
interface Marker {
  location: string,
  geocode: [number, number],
  popup: string
}


export default function LeafletMap(){
  //coordinates for Newark, NJ
  let newarkLat = 40.73566
  let newarkLong = -74.17237
  let currentZoom = 13
  let markerSize = 35

  const temporaryMarkers: Marker[] = [
    {
      location: "Prudential Center",
      geocode: [40.7335, -74.1711],
      popup: "I am prudential center"
    },
    {
      location: "NJIT Campus",
      geocode: [40.7424, -74.1784],
      popup: "I am NJIT campus."
    }
  ]
  const customMarkerIcon = new Icon({
    iconUrl: "/markerPing.png",
    iconSize: [markerSize, markerSize]
  })
  
  return(
    <MapContainer
      center={[newarkLat,newarkLong]}
      zoom={currentZoom}
      scrollWheelZoom={true}
      className="h-96 w-96"
    >
      <TileLayer 
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* map function to display all the marker locations of events within the given area. */}
      {temporaryMarkers.map(marker => (
        <Marker position={marker.geocode} icon={customMarkerIcon}>
          <Popup><h2>{marker.popup}</h2></Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}