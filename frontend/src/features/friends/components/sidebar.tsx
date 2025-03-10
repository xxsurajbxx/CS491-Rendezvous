import React from "react";

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
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

import Image from "next/image";

import { ProfileCard } from "./profile-card";
import { Tab, TabProps } from "../types";


export const FriendsSideBar: React.FC<TabProps> = ({ setWindow }) => {
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
      iconUrl: "/communityIcon.png"
    },
    {
      windowType: 'REQUESTS',
      title: "Friend Requests",
      url: "/reqeusts",
      iconUrl: "/friendsIcon.png"
    },
  ]

  return(
    <Sidebar variant="inset" collapsible="none" className="w-1/4 max-h-screen top-[80px]">
      <SidebarContent>
        <SidebarGroup>
          <ProfileCard />
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xl py-7">Friends</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-4">
              {sideTabs.map((tab, index) => (
                <button onClick={() => setWindow(tab.windowType)}>
                  <Card key={index} className="hover:bg-[#5C3B58]">
                    <CardContent>
                      <div className="flex flex-row items-center gap-x-2">
                        <Image src={tab.iconUrl} width={30} height={30} alt="icon image" />
                        <p>{tab.title}</p>
                      </div>
                    </CardContent>
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