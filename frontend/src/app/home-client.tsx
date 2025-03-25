"use client"

import NavigationBar from "@/components/navigation-bar"
import dynamic from "next/dynamic"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { EventSideBar } from "@/features/events/components/event-sidebar"
import { EventCardData } from "@/features/events/types"

// Dynamically load LeafletMap
const LeafletMap = dynamic(() => import("../components/leaflet-map"), {
  ssr: false,
})

export default function HomeClient() {
  

  return (
    <div>
      <header>
        <NavigationBar />
      </header>
      <SidebarProvider>
        <EventSideBar events={temporaryEventData} />
        <SidebarInset>
          <main className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
            <LeafletMap markers={temporaryLeafletMarkers} />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}

const temporaryEventData: EventCardData[] = [
  {
    title: 'Newark Museum of Art',
    date: "April 9",
    description: "Art event happening at museum. Lots of art sculptures.",
    where: "51 Park Pl, Newark, NJ 07102",
    startTime: "9:00pm",
    endTime: "12:00am",
    people: [
      "Danny Arco",
      "Chad Vincento",
      "Minny Palabi",
      "Marc Hamilton",
    ]
  },
  {
    title: 'Branch Brook Park Cherry Blossom Festival',
    date: "April 9",
    description: "Lots of cherry blossom trees. good for picnics.",
    where: "Park Avenue, Lake St, Newark, NJ 07104",
    startTime: "9:00am",
    endTime: "12:00pm",
    people: [
      "Danny Arco",
      "Chad Vincento",
      "Minny Palabi",
      "Marc Hamilton",
    ]
  },
  {
    title: 'Prudential Live',
    date: "April 9",
    description: "Cool event happening at Prudential. Bunch of bands playing here.",
    where: "25 Lafayette St, Newark, NJ 07102",
    startTime: "9:00pm",
    endTime: "12:00am",
    people: [
      "Danny Arco",
      "Chad Vincento",
      "Minny Palabi",
      "Marc Hamilton",
    ]
  },
  {
    title: 'NJIT Freshman Info Session',
    date: "April 9",
    description: "Information session for incoming freshman.",
    where: "323 Dr Martin Luther King Jr Blvd, Newark, NJ 07102",
    startTime: "9:00pm",
    endTime: "12:00am",
    people: [
      "Danny Arco",
      "Chad Vincento",
      "Minny Palabi",
      "Marc Hamilton",
    ]
  },
]

const temporaryLeafletMarkers = [
  {
    title: 'Newark Museum of Art',
    description: "Art event happening at museum. Lots of art sculptures.",
    locationLat: 40.742651,
    locationLong: -74.171779
  },
  {
    title: 'Branch Brook Park Cherry Blossom Festival',
    description: "Lots of cherry blossom trees. good for picnics.",
    locationLat: 40.7797,
    locationLong: -74.1748,
  },
  {
    title: 'Prudential Live',
    description: "Cool event happening at Prudential. Bunch of bands playing here.",
    locationLat: 40.7335,
    locationLong: -74.1711,
  },
  {
    title: 'NJIT Freshman Info Session',
    description: "Information session for incoming freshman.",
    locationLat: 40.7424,
    locationLong: -74.1784,
  },
]