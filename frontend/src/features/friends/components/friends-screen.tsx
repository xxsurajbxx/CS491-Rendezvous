"use client"

import React, { useCallback, useEffect, useState } from "react";

import NavigationBar from "@/components/navigation-bar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { FriendsSideBar } from "./sidebar";
import { FriendsTabType, PersonProfile, RsvpCard } from "../types";

import { RsvpWindow } from "./rsvp-window";
import { CommunityWindow } from "./community-window";
import { RequestsWindow } from "./requests-window";

interface FriendsScreenProps {
  userId: number;
  //email: string;
  //name: string;
}

interface FriendRequest {
  FriendID: number; // This is an integer in the database, you can keep it as a number
  UserID: number;   // Similarly, UserID will be an integer
  Name: string;     // Name is a string
  Email: string;    // Email is a string
}


export const FriendsScreen = ({userId}: FriendsScreenProps ) => {
  const [tabType, setTabType] = useState<FriendsTabType>('COMMUNITY');
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);

  

  // This function will be passed down to the RequestsWindow to update the count

  const updateFriendRequests = (requests: FriendRequest[]) => {
    setFriendRequests(requests);
  };


    // Function to get the friend requests
    const getFriendRequests = useCallback(async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/friends/requests/${userId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
  
        if (!response.ok) throw new Error('Failed to fetch friend requests');
  
        const result = await response.json();
        setFriendRequests(result.data);
        console.log(friendRequests)

      } catch (error) {
        console.error('Error fetching friend requests:', error);
      }
    }, [userId, friendRequests]);
  
    // UseEffect to fetch friend requests when the userId changes
    useEffect(() => {
      getFriendRequests();
    }, [userId, getFriendRequests]);

  return(
    <div>
      <header>
        <NavigationBar />
      </header>
      <SidebarProvider>
        <FriendsSideBar setWindow={setTabType} friendRequests={friendRequests}/>
        <SidebarInset>
          <div className="h-full bg-gray-100 p-6">
            {tabType === 'COMMUNITY' && <CommunityWindow personProfiles={placeholderPersonProfiles} />}
            {tabType === 'RSVP' && <RsvpWindow rsvpCards={placeholderRsvpCards} />}
            {tabType === 'REQUESTS' && <RequestsWindow userId={userId} friendRequests={friendRequests} updateFriendRequests={updateFriendRequests} />}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

const placeholderPersonProfiles: PersonProfile[] = [
  {
    name: "John Green",
    photo: "/profileIcon.png"
  },
  {
    name: "Michelle Gru",
    photo: "/profileIcon.png"
  },
  {
    name: "Christy Glassman",
    photo: "/profileIcon.png"
  },
  {
    name: "Leah Wan",
    photo: "/profileIcon.png"
  },
  {
    name: "Michael Creaton",
    photo: "/profileIcon.png"
  },
  {
    name: "Keeanu Reeves",
    photo: "/profileIcon.png"
  },
  {
    name: "John Green",
    photo: "/profileIcon.png"
  },
  {
    name: "Michelle Lee",
    photo: "/profileIcon.png"
  },
  {
    name: "Christy Glassman",
    photo: "/profileIcon.png"
  },
  {
    name: "Leah Wan",
    photo: "/profileIcon.png"
  },
  {
    name: "Michael Creaton",
    photo: "/profileIcon.png"
  },
  {
    name: "Keeanu Reeves",
    photo: "/profileIcon.png"
  },
  
]

const placeholderRsvpCards: RsvpCard[] = [
  {
    eventName: "Green Day Live",
    host: "John Deere",
    location: "23 Westford Ave, Newark, NJ",
    date: new Date(2025, 5, 10),
    startTime: "8:00pm",
    endTime: "10:00pm",
    maxRSVP: 8,
    rsvpList: [
      {
        name: "John Green",
        photo: "/profileIcon.png"
      },
      {
        name: "Michelle Lee",
        photo: "/profileIcon.png"
      },
      {
        name: "Christy Glassman",
        photo: "/profileIcon.png"
      },
      {
        name: "Leah Wan",
        photo: "/profileIcon.png"
      },
      {
        name: "Michael Creaton",
        photo: "/profileIcon.png"
      },
      {
        name: "Keeanu Reeves",
        photo: "/profileIcon.png"
      },
    ]
  },
  {
    eventName: "Green Day Live",
    host: "John Deere",
    location: "123 Fordham Place, Newark, NJ",
    date: new Date(2025, 6, 23),
    startTime: "8:00pm",
    endTime: "10:00pm",
    maxRSVP: 8,
    rsvpList: [
      {
        name: "John Green",
        photo: "/profileIcon.png"
      },
      {
        name: "Michelle Lee",
        photo: "/profileIcon.png"
      },
      {
        name: "Christy Glassman",
        photo: "/profileIcon.png"
      },
      {
        name: "Leah Wan",
        photo: "/profileIcon.png"
      },
      {
        name: "Michael Creaton",
        photo: "/profileIcon.png"
      },
      {
        name: "Keeanu Reeves",
        photo: "/profileIcon.png"
      },
    ]
  },
  {
    eventName: "Green Day Live",
    host: "John Deere",
    location: "68 Westhel Drive, Newark, NJ",
    date: new Date(2025, 8, 1),
    startTime: "8:00pm",
    endTime: "10:00pm",
    maxRSVP: 8,
    rsvpList: [
      {
        name: "John Green",
        photo: "/profileIcon.png"
      },
      {
        name: "Michelle Lee",
        photo: "/profileIcon.png"
      },
      {
        name: "Christy Glassman",
        photo: "/profileIcon.png"
      },
      {
        name: "Leah Wan",
        photo: "/profileIcon.png"
      },
      {
        name: "Michael Creaton",
        photo: "/profileIcon.png"
      },
      {
        name: "Keeanu Reeves",
        photo: "/profileIcon.png"
      },
    ]
  },
  {
    eventName: "Green Day Live",
    host: "John Deere",
    location: "3 Place Park, Newark, NJ",
    date: new Date(2025, 7, 28),
    startTime: "8:00pm",
    endTime: "10:00pm",
    maxRSVP: 8,
    rsvpList: [
      {
        name: "John Green",
        photo: "/profileIcon.png"
      },
      {
        name: "Michelle Lee",
        photo: "/profileIcon.png"
      },
      {
        name: "Christy Glassman",
        photo: "/profileIcon.png"
      },
      {
        name: "Leah Wan",
        photo: "/profileIcon.png"
      },
      {
        name: "Michael Creaton",
        photo: "/profileIcon.png"
      },
      {
        name: "Keeanu Reeves",
        photo: "/profileIcon.png"
      },
    ]
  },
  {
    eventName: "Green Day Live",
    host: "John Deere",
    location: "8 Jamaica Avenue, Newark, NJ",
    date: new Date(2025, 7, 1),
    startTime: "8:00pm",
    endTime: "10:00pm",
    maxRSVP: 8,
    rsvpList: [
      {
        name: "John Green",
        photo: "/profileIcon.png"
      },
      {
        name: "Michelle Lee",
        photo: "/profileIcon.png"
      },
      {
        name: "Christy Glassman",
        photo: "/profileIcon.png"
      },
      {
        name: "Leah Wan",
        photo: "/profileIcon.png"
      },
      {
        name: "Michael Creaton",
        photo: "/profileIcon.png"
      },
      {
        name: "Keeanu Reeves",
        photo: "/profileIcon.png"
      },
    ]
  },
]