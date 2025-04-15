import React from "react";
//import { Calendar } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import {
  Card,
} from "@/components/ui/card";
import Image from "next/image";
import { ProfileCard } from "./profile-card";
import { Tab, TabProps } from "../types";

interface FriendRequest {
  FriendID: number; // This is an integer in the database, you can keep it as a number
  UserID: number;   // Similarly, UserID will be an integer
  Name: string;     // Name is a string
  Email: string;    // Email is a string
}

interface FriendsSideBarProps extends TabProps {
  name: string,
  friendRequests: FriendRequest[];  // Add the count prop
}




export const FriendsSideBar: React.FC<FriendsSideBarProps> = ({ name, setWindow, friendRequests }) => {

  return(
    <Sidebar variant="inset" collapsible="none" className="w-1/4 max-h-screen top-[80px]">
      <SidebarContent>
        <SidebarGroup>
          <ProfileCard name={name} />
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xl py-7">Friends</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-4">
              {sideTabs.map((tab, index) => (
                <button key={index} onClick={() => setWindow(tab.windowType)}>
                  <Card key={index} className="flex flex-row p-3 gap-x-3 h-12 items-center hover:bg-[#5C3B58]">
                    <Image src={tab.iconUrl} width={30} height={30} alt="icon image" />
                    <p>{tab.title}</p>
                    {tab.windowType === 'REQUESTS' && friendRequests.length > 0 && (  // Show count next to "Friend Requests"
                      <span className="ml-2 text-sm text-red-600">{friendRequests.length}</span>
                    )}
                  </Card>
                </button>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

const sideTabs: Tab[] = [
  {
    windowType: 'COMMUNITY',
    title: "Community",
    url: "/community",
    iconUrl: "/communityIcon.png"
  },
  {
    windowType: 'RSVP',
    title: "RSVP's",
    url: "/rsvp",
    iconUrl: "/rsvpIcon.png"
  },
  {
    windowType: 'REQUESTS',
    title: "Friend Requests",
    url: "/reqeusts",
    iconUrl: "/friendsIcon.png"
  },
]