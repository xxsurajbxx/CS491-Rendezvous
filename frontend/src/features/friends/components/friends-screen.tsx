"use client"

import React, { useEffect, useState } from "react";

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

interface Friend {
  FriendID: number;
  UserID: number;
  Name: string;
  Email: string;
  Since: string;
}


export const FriendsScreen = ({userId}: FriendsScreenProps ) => {
  const [tabType, setTabType] = useState<FriendsTabType>('COMMUNITY');
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);

  // This function will be passed down to the RequestsWindow to update the count

  const updateFriendRequests = (requests: FriendRequest[]) => {
    setFriendRequests(requests);
  };

  const updateFriends = (friends: Friend[]) => {
    setFriends(friends);
  };


  // Function to get the friend requests
  const getFriendRequests = async () => {
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
  };


  const getFriends = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/friends/all/${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to fetch friend requests');

      const result = await response.json();
      setFriends(result.data);
      console.log(friends)

    } catch (error) {
      console.error('Error fetching friend requests:', error);
    }
  };

  
  useEffect(() => {
    if (tabType === "COMMUNITY") {
      getFriends(); // Fetch friends when the "Community" tab is active
    } else if (tabType === "REQUESTS") {
      getFriendRequests(); // Fetch friend requests when the "Requests" tab is active
    }
  }, [tabType]); // Runs when `tabType` changes

  // Set up polling for friend requests every minute
  useEffect(() => {
    // Initial fetch
    getFriendRequests()

    // Set up interval to check every minute (60000 milliseconds)
    // NOTE: for the future, implement WebSockets 
    const intervalId = setInterval(() => {
      console.log("Checking for new friend requests...")
      getFriends();
      getFriendRequests();
    }, 60000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId)
  }, [])

  return(
    <div>
      <header>
        <NavigationBar />
      </header>
      <SidebarProvider>
        <FriendsSideBar setWindow={setTabType} friendRequests={friendRequests}/>
        <SidebarInset>
          <div className="h-full bg-gray-100 p-6">
            {tabType === 'COMMUNITY' && <CommunityWindow userId={userId} friends={friends} updateFriends={updateFriends} personProfiles={placeholderPersonProfiles}/>}
            {tabType === 'RSVP' && <RsvpWindow rsvpCards={placeholderRsvpCards} />}
            {tabType === 'REQUESTS' && <RequestsWindow userId={userId} friendRequests={friendRequests} updateFriendRequests={updateFriendRequests} updateFriends={updateFriends}/>}
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