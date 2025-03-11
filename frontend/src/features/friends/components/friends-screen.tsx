"use client"

import React, { useState } from "react";

import NavigationBar from "@/components/navigation-bar";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { FriendsSideBar } from "./sidebar";
import { FriendsTabType, PersonProfile } from "../types";

import { RsvpWindow } from "./rsvp-window";
import { CommunityWindow } from "./community-window";
import { RequestsWindow } from "./requests-window";


export const FriendsScreen = () => {
  const [tabType, setTabType] = useState<FriendsTabType>('COMMUNITY');

  const placeholderPersonProfiles: PersonProfile[] = [
    {
      name: "John Green",
      photo: "/profileIcon.png"
    },
    {
      name: "Michelle Lay",
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
      name: "Michelle Lay",
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

  return(
    <div>
      <header>
        <NavigationBar />
      </header>
      <SidebarProvider>
        <FriendsSideBar setWindow={setTabType} />
        <SidebarInset>
          <main className="min-h-screen bg-gray-100 p-6">
            {tabType === 'COMMUNITY' && <CommunityWindow personProfiles={placeholderPersonProfiles} />}
            {tabType === 'RSVP' && <RsvpWindow />}
            {tabType === 'REQUESTS' && <RequestsWindow />}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}