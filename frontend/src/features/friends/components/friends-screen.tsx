"use client"

import React, { useState } from "react";

import NavigationBar from "@/components/navigation-bar";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { FriendsSideBar } from "./sidebar";
import { FriendsTabType } from "../types";

import { RsvpWindow } from "./rsvp-window";
import { CommunityWindow } from "./community-window";
import { RequestsWindow } from "./requests-window";


export const FriendsScreen = () => {
  const [tabType, setTabType] = useState<FriendsTabType>('COMMUNITY');

  return(
    <div>
      <header>
        <NavigationBar />
      </header>
      <SidebarProvider>
        <FriendsSideBar setWindow={setTabType} />
        <SidebarInset>
          <main className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
            {tabType === 'COMMUNITY' && <CommunityWindow />}
            {tabType === 'RSVP' && <RsvpWindow />}
            {tabType === 'REQUESTS' && <RequestsWindow />}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}