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
    setOpenEventCards((prev) =>
      prev.includes(eventCard)
        ? prev.filter((currentEventCard) => currentEventCard !== eventCard)
        : [...prev, eventCard]
    )
    if (targetElementCard) {
      targetElementCard.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
    }
  }

  const getAllEventsData = async () => {
    try {
      setEventsData(undefined);
      setEventCards(undefined);
      setOpenEventCards([]);

      // Fetch all events
      let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/user-events/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Error occurred while fetching all event data.')

      let result = await response.json();
      const events = result.events;

      // Fetch RSVP data
      response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rsvp?userId=${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error("Error occurred while fetching rsvp data.");

      result = await response.json();
      const rsvps = result.data;
      const rsvpEventIds = rsvps.map((r: RsvpData) => r.EventID);

      events.forEach((event: EventData) => {
        event.attending = rsvpEventIds.includes(event.EventID);
      });

      setEventsData(events);
    } catch (error) {
      console.error('Fetch error:', error);
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
      isHost: event.HostUserID === id,
      isOpen: (eventCardId: string) => openEventCards.includes(eventCardId),
      setShowPopup: setShowPopup,
      id: id
    }));

    setEventCards(eventCardsData);
  }, [eventsData, openEventCards]);

  const getLeafletMarkersData = (): LeafletMarker[] | undefined => {
    const leafletMarkersData: LeafletMarker[] = [];
    eventsData?.forEach(event => {
      if (event.Latitude && event.Longitude) {
        leafletMarkersData.push({
          EventID: event.EventID,
          Name: event.Name,
          Description: event.Description,
          Latitude: event.Latitude,
          Longitude: event.Longitude
        });
      }
    });
    return leafletMarkersData.length > 0 ? leafletMarkersData : undefined;
  }

  const handleSearch = async (query: string) => {
    setEventsData(undefined);
    setEventCards(undefined);
    setOpenEventCards([]);
    if (!query.trim()) {
      getAllEventsData();
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, userId: id })
      });

      const results = await response.json();
      const events = results.data;

      if (!response.ok || results.status === "fail") throw new Error("Error occurred while searching for events");

      // Fetch RSVP data
      const rsvpResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rsvp?userId=${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!rsvpResponse.ok) throw new Error("Error occurred while fetching rsvp data.");

      const rsvpResult = await rsvpResponse.json();
      const rsvps = rsvpResult.data;
      const rsvpEventIds = rsvps.map((r: RsvpData) => r.EventID);

      events.forEach((event: EventData) => {
        event.attending = rsvpEventIds.includes(event.EventID);
      });

      setEventsData(events);
    } catch (error) {
      console.warn(error);
    }
  }

  useEffect(() => {
    getAllEventsData();
    getCoordinatesFromAddress(address, setCoordinates);
  }, [address]);

  useEffect(() => {
    if (eventsData) {
      getEventCardsData();
    }
  }, [eventsData, getEventCardsData]);

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
          id={id}
          events={eventCards}
          openEventCards={openEventCards}
          setOpenEventCards={setOpenEventCards}
          isOpen={isOpen}
          handleSearch={handleSearch}
          setShowPopup={setShowPopup}
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
