/**
 * Events map component that shows the different events within the city of Newark.
 */

"use client"

//leaflet imports here
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { Icon } from "leaflet";
import { LeafletMarker } from "@/features/events/types";
import { useEffect } from "react";

type LeafletMapProps = {
  userCoordinates: {lat: number, lon: number},
  markers: LeafletMarker[] | undefined,
  handleOpenEventCard(id: string): void
}

type RecenterMapProps = {
  lat: number;
  lon: number;
};

const RecenterMap = ({ lat, lon }: RecenterMapProps) => {
  const map = useMap();

  useEffect(() => {
    map.setView([lat, lon], map.getZoom(), {
      animate: true,
    });
  }, [lat, lon, map]);

  return null;
};

export default function LeafletMap({ userCoordinates, markers, handleOpenEventCard }: LeafletMapProps){
  //coordinates based on user's address
  const currentZoom = 13
  const markerSize = 45

  const customMarkerIcon = new Icon({
    iconUrl: "/companyLogo.png",
    iconSize: [markerSize, markerSize]
  })

  useEffect(() => {
    
  },[])
  
  return(
    <MapContainer
      center={[userCoordinates.lat, userCoordinates.lon]}
      zoom={currentZoom}
      scrollWheelZoom={true}
      className="h-full w-full rounded-lg z-10"
    >
      <TileLayer 
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Recenter map when coordinates change */}
      <RecenterMap lat={userCoordinates.lat} lon={userCoordinates.lon} />

      {/* map function to display all the marker locations of events within the given area. */}
      {markers?.map((marker, index) => (
        <Marker
          key={index}
          position={[marker.Latitude, marker.Longitude]}
          icon={customMarkerIcon}
          eventHandlers={{
            click: () => handleOpenEventCard('event-card-'+marker.EventID)
          }}
        >
          <Popup><h2>{marker.Name}</h2></Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}