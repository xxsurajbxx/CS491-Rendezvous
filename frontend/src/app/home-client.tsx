"use client"

import NavigationBar from "@/components/navigation-bar"
import dynamic from "next/dynamic"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { EventSideBar } from "@/features/events/components/event-sidebar"
import { EventCardData } from "@/features/events/types"
import { useEffect, useState } from "react"

// Dynamically load LeafletMap
const LeafletMap = dynamic(() => import("../components/leaflet-map"), {
  ssr: false,
})

export default function HomeClient() {
  const [eventCardsData, setEventCardsData] = useState<EventCardData[] | undefined>(undefined)
  const [openEventCards, setOpenEventCards] = useState<string[]>([])
  
  const handleOpenEventCard = (eventCard: string) => {
    const targetElementCard = document.getElementById(eventCard)
    setOpenEventCards((prev) => (
      prev.includes(eventCard) ? prev.filter((currentEventCard) => currentEventCard !== eventCard) : [...prev, eventCard]
    ))
    if (targetElementCard) {
      targetElementCard.scrollIntoView({behavior: 'smooth', block: 'center', inline: 'nearest'})
    }
  }
  
  const getAllEventCardData = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/events/user-events', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Bad Request. Try Again.')

      const result = await response.json();
      setEventCardsData(result.events)
      console.log(result.events)
    } catch (error) {
      console.error('Fetch error:', error)
    }
  }

  const splitEventCardsData = (eventsData: EventCardData[]) => {
    
  }

  useEffect(() => {
    
    getAllEventCardData()
  }, [])

  return (
    <div>
      <header>
        <NavigationBar />
      </header>
      <SidebarProvider>
        <EventSideBar
          events={eventCardsData}
          openEventCards={openEventCards}
          setOpenEventCards={setOpenEventCards}
        />
        <SidebarInset>
          <main className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
            <LeafletMap
              markers={temporaryLeafletMarkers}
              handleOpenEventCard={handleOpenEventCard}
            />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}

const temporaryEventData: EventCardData[] = [
  {
    EventID: 1,
    Name: 'Newark Museum of Art',
    Description: "Art event happening at museum. Lots of art sculptures.",
    location: "51 Park Pl, Newark, NJ 07102",
    startDateTime: new Date("April 9, 1995 03:24:00"),
    endTime: new Date("April 9, 1995 03:24:00"),
    people: [
      "Danny Arco",
      "Chad Vincento",
      "Minny Palabi",
      "Marc Hamilton",
    ]
  },
  {
    EventID: 2,
    Name: 'Branch Brook Park Cherry Blossom Festival',
    Description: "Lots of cherry blossom trees. good for picnics.",
    location: "Park Avenue, Lake St, Newark, NJ 07104",
    startDateTime: new Date("April 9, 1995 03:24:00"),
    endTime: new Date("April 9, 1995 03:24:00"),
    people: [
      "Danny Arco",
      "Chad Vincento",
      "Minny Palabi",
      "Marc Hamilton",
    ]
  },
  {
    EventID: 3,
    Name: 'Prudential Live',
    Description: "Cool event happening at Prudential. Bunch of bands playing here.",
    location: "25 Lafayette St, Newark, NJ 07102",
    startDateTime: new Date("April 9, 1995 03:24:00"),
    endTime: new Date("April 9, 1995 03:24:00"),
    people: [
      "Danny Arco",
      "Chad Vincento",
      "Minny Palabi",
      "Marc Hamilton",
    ]
  },
  {
    EventID: 4,
    Name: 'NJIT Freshman Info Session',
    Description: "Information session for incoming freshman.",
    location: "323 Dr Martin Luther King Jr Blvd, Newark, NJ 07102",
    startDateTime: new Date("April 9, 1995 03:24:00"),
    endTime: new Date("April 9, 1995 03:24:00"),
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
    EventID: 1,
    Name: 'Newark Museum of Art',
    Description: "Art event happening at museum. Lots of art sculptures.",
    Latitude: 40.742651,
    Longitude: -74.171779
  },
  {
    EventID: 2,
    Name: 'Branch Brook Park Cherry Blossom Festival',
    Description: "Lots of cherry blossom trees. good for picnics.",
    Latitude: 40.7797,
    Longitude: -74.1748,
  },
  {
    EventID: 3,
    Name: 'Prudential Live',
    Description: "Cool event happening at Prudential. Bunch of bands playing here.",
    Latitude: 40.7335,
    Longitude: -74.1711,
  },
  {
    EventID: 4,
    Name: 'NJIT Freshman Info Session',
    Description: "Information session for incoming freshman.",
    Latitude: 40.7424,
    Longitude: -74.1784,
  },
]