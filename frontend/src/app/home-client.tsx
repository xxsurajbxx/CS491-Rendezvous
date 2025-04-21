"use client"

import NavigationBar from "@/components/navigation-bar"
import dynamic from "next/dynamic"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { EventSideBar } from "@/features/events/components/event-sidebar"
import { EventData, EventCardData, LeafletMarker } from "@/features/events/types"
import { useEffect, useState } from "react"

interface HomeClientProps {
  address: string;
}

// Dynamically load LeafletMap
const LeafletMap = dynamic(() => import("../components/leaflet-map"), {
  ssr: false,
})

const getCoordinatesFromAddress = async (
  address: string,
  setCoordinates: React.Dispatch<React.SetStateAction<{ lat: number; lon: number }>>
) => {
  const GEOAPIFY_API_KEY = "26de8e62cc3b4b849f60c43d5b4e82a7"
  const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&apiKey=${GEOAPIFY_API_KEY}`

  try {
    const response = await fetch(url)
    const data = await response.json()

    if (data.features && data.features.length > 0) {
      const { lat, lon } = data.features[0].properties
      setCoordinates({ lat, lon })
    } else {
      console.warn("No coordinates found for address")
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error)
  }
}

export default function HomeClient({ address }: HomeClientProps) {
  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number }>({
    lat: 40.7128,
    lon: -74.006,
  });
  const [eventsData, setEventsData] = useState<EventData[] | undefined>(undefined);
  const [openEventCards, setOpenEventCards] = useState<string[]>([]);

  const isOpen = (eventCardId: string): boolean => {
    return openEventCards.includes(eventCardId)
  }
  
  const handleOpenEventCard = (eventCard: string) => {
    const targetElementCard = document.getElementById(eventCard)
    setOpenEventCards((prev) => (
      prev.includes(eventCard) ? prev.filter((currentEventCard) => currentEventCard !== eventCard) : [...prev, eventCard]
    ))
    if (targetElementCard) {
      targetElementCard.scrollIntoView({behavior: 'smooth', block: 'center', inline: 'nearest'})
    }
  }
  
  const getAllEventsData = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/events/user-events', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Bad Request. Try Again.')

      const result = await response.json();
      setEventsData(result.events)
      console.log(result.events)
    } catch (error) {
      console.error('Fetch error:', error)
    }
  }

  const getEventCardsData = (): EventCardData[] | undefined => {
    const eventCardsData: EventCardData[] = []
    eventsData?.forEach(event => {
      eventCardsData.push({
        EventID: event.EventID,
        Name: event.Name,
        startDateTime: event.startDateTime,
        endDateTime: event.endDateTime,
        Description: event.Description,
        Location: event.Location,
        people: event.people,
        isOpen: isOpen
      })
    })
    return eventCardsData.length > 0 ? eventCardsData : undefined;
  }

  const getLeafletMarkersData = (): LeafletMarker[] | undefined => {
    const leafletMarkersData: LeafletMarker[] = []
    eventsData?.forEach(event => {
      if (event.Latitude && event.Longitude) {
        leafletMarkersData.push({
          EventID: event.EventID,
          Name: event.Name,
          Description: event.Description,
          Latitude: event.Latitude,
          Longitude: event.Longitude
        })
      }
    })
    return leafletMarkersData.length > 0 ? leafletMarkersData : undefined;
  }

  // function for handling search results using search api endpoint
  const handleSearch = async (query: string) => {
    const url = `http://localhost:8080/api/events/search?query=${encodeURIComponent(query)}`

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const results = await response.json();

      if (!response.ok || results.status === "fail") throw new Error("Error occured while searching for events")
      if (results.data.length > 0) {
        setEventsData(results.data)
      } else {
        // search results returned no events based on given search query from user
        console.log("No event results matched the user's query.")
      }
      console.log(results)
    } catch(error) {
      console.warn(error)
    }
  }

  useEffect(() => {
    getAllEventsData();
    getCoordinatesFromAddress(address, setCoordinates);
  }, [address]);  

  return (
    <div>
      <header>
        <NavigationBar />
      </header>
      <SidebarProvider>
        <EventSideBar
          events={getEventCardsData()}
          openEventCards={openEventCards}
          setOpenEventCards={setOpenEventCards}
          isOpen={isOpen}
          handleSearch={handleSearch}
        />
        <SidebarInset>
          <main className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
            <LeafletMap
              userCoordinates={coordinates}
              markers={getLeafletMarkersData()}
              handleOpenEventCard={handleOpenEventCard}
            />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}

// const temporaryEventData: EventCardData[] = [
//   {
//     EventID: 1,
//     Name: 'Newark Museum of Art',
//     Description: "Art event happening at museum. Lots of art sculptures.",
//     location: "51 Park Pl, Newark, NJ 07102",
//     startDateTime: new Date("April 9, 1995 03:24:00"),
//     endTime: new Date("April 9, 1995 03:24:00"),
//     people: [
//       "Danny Arco",
//       "Chad Vincento",
//       "Minny Palabi",
//       "Marc Hamilton",
//     ]
//   },
//   {
//     EventID: 2,
//     Name: 'Branch Brook Park Cherry Blossom Festival',
//     Description: "Lots of cherry blossom trees. good for picnics.",
//     location: "Park Avenue, Lake St, Newark, NJ 07104",
//     startDateTime: new Date("April 9, 1995 03:24:00"),
//     endTime: new Date("April 9, 1995 03:24:00"),
//     people: [
//       "Danny Arco",
//       "Chad Vincento",
//       "Minny Palabi",
//       "Marc Hamilton",
//     ]
//   },
//   {
//     EventID: 3,
//     Name: 'Prudential Live',
//     Description: "Cool event happening at Prudential. Bunch of bands playing here.",
//     location: "25 Lafayette St, Newark, NJ 07102",
//     startDateTime: new Date("April 9, 1995 03:24:00"),
//     endTime: new Date("April 9, 1995 03:24:00"),
//     people: [
//       "Danny Arco",
//       "Chad Vincento",
//       "Minny Palabi",
//       "Marc Hamilton",
//     ]
//   },
//   {
//     EventID: 4,
//     Name: 'NJIT Freshman Info Session',
//     Description: "Information session for incoming freshman.",
//     location: "323 Dr Martin Luther King Jr Blvd, Newark, NJ 07102",
//     startDateTime: new Date("April 9, 1995 03:24:00"),
//     endTime: new Date("April 9, 1995 03:24:00"),
//     people: [
//       "Danny Arco",
//       "Chad Vincento",
//       "Minny Palabi",
//       "Marc Hamilton",
//     ]
//   },
// ]

// const temporaryLeafletMarkers = [
//   {
//     EventID: 1,
//     Name: 'Newark Museum of Art',
//     Description: "Art event happening at museum. Lots of art sculptures.",
//     Latitude: 40.742651,
//     Longitude: -74.171779
//   },
//   {
//     EventID: 2,
//     Name: 'Branch Brook Park Cherry Blossom Festival',
//     Description: "Lots of cherry blossom trees. good for picnics.",
//     Latitude: 40.7797,
//     Longitude: -74.1748,
//   },
//   {
//     EventID: 3,
//     Name: 'Prudential Live',
//     Description: "Cool event happening at Prudential. Bunch of bands playing here.",
//     Latitude: 40.7335,
//     Longitude: -74.1711,
//   },
//   {
//     EventID: 4,
//     Name: 'NJIT Freshman Info Session',
//     Description: "Information session for incoming freshman.",
//     Latitude: 40.7424,
//     Longitude: -74.1784,
//   },
// ]