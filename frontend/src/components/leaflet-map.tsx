/**
 * Events map component that shows the different events within the city of Newark.
 */

"use client"

//leaflet imports here
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { Icon } from "leaflet";

//Defines a marked position on the leaflet map including name of location, coordinates of location, and a popup description that describes that location/event.
interface LeafletMarker {
  title: string,
  description: string,
  locationLat: number,
  locationLong: number
}

type LeafletMapProps = {
  markers: LeafletMarker[]
}


export default function LeafletMap({ markers }: LeafletMapProps){
  //coordinates for Newark, NJ
  const newarkLat = 40.73566
  const newarkLong = -74.17237
  const currentZoom = 13
  const markerSize = 35

  // const temporaryMarkers: LeafletMarker[] = [
  //   {
  //     title: "Prudential Center",
  //     locationLat: 40.7335,
  //     locationLong: -74.1711,
  //     description: "I am prudential center"
  //   },
  //   {
  //     title: "NJIT Campus",
  //     locationLat: 40.7424,
  //     locationLong: -74.1784,
  //     description: "I am NJIT campus."
  //   }
  // ]
  const customMarkerIcon = new Icon({
    iconUrl: "/companyLogo.png",
    iconSize: [markerSize, markerSize]
  })
  
  return(
    <MapContainer
      center={[newarkLat,newarkLong]}
      zoom={currentZoom}
      scrollWheelZoom={true}
      className="h-full w-full rounded-lg"
    >
      <TileLayer 
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* map function to display all the marker locations of events within the given area. */}
      {markers.map((marker, index) => (
        <Marker key={index} position={[marker.locationLat, marker.locationLong]} icon={customMarkerIcon}>
          <Popup><h2>{marker.description}</h2></Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}