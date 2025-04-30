"use client"

import NavigationBar from "@/components/navigation-bar"
import dynamic from "next/dynamic"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { EventSideBar } from "@/features/events/components/event-sidebar"
import { EventData, EventCardData, LeafletMarker } from "@/features/events/types"
import { useCallback, useEffect, useState } from "react"
import { RsvpData } from "@/features/friends/types"
import { VerifyPopup } from "@/features/verify/VerifyPopup"
import { getTokenPayload } from "../../utils/auth"

interface HomeClientProps {
  id: number;
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
  const GEOAPIFY_API_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_KEY;
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

export default function HomeClient({ id, address }: HomeClientProps) {
  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number }>({
    lat: 40.7128,
    lon: -74.006,
  });
  const [eventsData, setEventsData] = useState<EventData[] | undefined>(undefined);
  const [eventCards, setEventCards] = useState<EventCardData[] | undefined>(undefined);
  const [openEventCards, setOpenEventCards] = useState<string[]>([]);

  // verify user account variable
  const [showPopup, setShowPopup] = useState<boolean>(false);

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
      // fetching all events
      let response = await fetch(`http://localhost:8080/api/events/user-events/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Error occurred while fetching all event data. Try Again.')

      let result = await response.json();
      const events = result.events;
      // console.log(events);

      // fetching events that user RSVP'ed to
      response = await fetch(`http://localhost:8080/api/rsvp?userId=${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
      if (!response.ok) throw new Error("Error occurred while fetching rsvp data.");

      result = await response.json();
      const rsvps = result.data;
      // console.log(rsvps);

      // setting attending status based on if the eventId is in the list of rsvp's
      const rsvpEventIds = rsvps.map((r: RsvpData) => r.EventID); // array of unique rsvp event id's
      
      events.forEach((event: EventData) => {
        event.attending = rsvpEventIds.includes(event.EventID) ? true : false
      });
      setEventsData(events)
      console.log(events)

    } catch (error) {
      console.error('Fetch error:', error)
    }
  }

  const getEventCardsData = useCallback(() => {
    if (!eventsData) return;

    const eventCardsData: EventCardData[] = eventsData.map(event => ({
      EventID: event.EventID,
      Name: event.Name,
      startDateTime: event.startDateTime,
      endDateTime: event.endDateTime,
      Description: event.Description,
      HostUserID: event.HostUserID,
      Location: event.Location,
      people: event.people,
      attending: event.attending,
      isOpen: (eventCardId: string) => openEventCards.includes(eventCardId),
    }));
    setEventCards(eventCardsData);
  }, [eventsData, openEventCards])

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
    console.log("Searching")
    // If query is empty, reload original data using the fetch function that gets all eventsData
    if (!query.trim()) {
      getAllEventsData();
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/events/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: query,
          userId: id
        })
      });
      const results = await response.json();
      const events = results.data;

      if (!response.ok || results.status === "fail") throw new Error("Error occured while searching for events")
      if (events.length > 0) {
        setEventsData(results.data)
      } else {
        // search results returned no events based on given search query from user
        console.log("No event results matched the user's query.")
      }

         // fetching events that user RSVP'ed to
        const response2 = await fetch(`http://localhost:8080/api/rsvp?userId=${id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
        if (!response2.ok) throw new Error("Error occurred while fetching rsvp data.");
  
        const result = await response2.json();
        const rsvps = result.data;
        // console.log(rsvps);
  
        // setting attending status based on if the eventId is in the list of rsvp's
        const rsvpEventIds = rsvps.map((r: RsvpData) => r.EventID); // array of unique rsvp event id's
        
        events.forEach((event: EventData) => {
          event.attending = rsvpEventIds.includes(event.EventID) ? true : false
        });
        setEventsData(events)
        console.log(events)


      console.log(results)
    } catch(error) {
      console.warn(error)
    }
  }

  useEffect(() => {
    
    getAllEventsData();
    getCoordinatesFromAddress(address, setCoordinates);
  }, [address]);  

  useEffect(() => {
    
    getEventCardsData();
  }, [getEventCardsData])

  // run for user verification popup window
  useEffect(() => {

    const checkUserVerification = async () => {
      const token = await getTokenPayload();
      if (!token) {
        console.error("No jwt token retrieved.");
        return;
      }
      // console.log(token)
  
      if (!token.verified) {
        setShowPopup(true);
        console.log("User is not verified");
      }
    };

    checkUserVerification();
  }, [])

  return (
    <div>
      <header>
        <NavigationBar />
      </header>
      <SidebarProvider>
        <EventSideBar
          events={eventCards}
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

      {/* Verification popup window */}
      {showPopup && <VerifyPopup setShowPopup={setShowPopup} />}
    </div>
  )
}