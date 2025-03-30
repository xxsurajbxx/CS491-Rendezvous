/**
 * Events map component that shows the different events within the city of Newark.
 */

"use client"

//leaflet imports here
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { Icon } from "leaflet";
import { LeafletMarker } from "@/features/events/types";

type LeafletMapProps = {
  markers: LeafletMarker[] | undefined,
  handleOpenEventCard(id: string): void
}


export default function LeafletMap({ markers, handleOpenEventCard }: LeafletMapProps){
  //coordinates for Newark, NJ
  const newarkLat = 40.73566
  const newarkLong = -74.17237
  const currentZoom = 13
  const markerSize = 45

  const customMarkerIcon = new Icon({
    iconUrl: "/companyLogo.png",
    iconSize: [markerSize, markerSize]
  })
  
  return(
    <MapContainer
      center={[newarkLat,newarkLong]}
      zoom={currentZoom}
      scrollWheelZoom={true}
      className="h-full w-full rounded-lg z-10"
    >
      <TileLayer 
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
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