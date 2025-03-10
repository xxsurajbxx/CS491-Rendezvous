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


export const FriendsSideBar = () => {
  const sideTabs = [
    {
      title: "Community",
      url: "/community",
      iconUrl: "/communityIcon.png"
    },
    {
      title: "RSVP's",
      url: "/rsvp",
      iconUrl: "/communityIcon.png"
    },
    {
      title: "Friend Requests",
      url: "/reqeusts",
      iconUrl: "/friendsIcon.png"
    },
  ]

  return(
    <Sidebar variant="inset" collapsible="none" className="w-1/4 max-h-screen top-[80px]">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xl py-7">Events</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-4">
              {sideTabs.map((tab, index) => (
                <Card key={index}>
                  <CardContent>
                    <div className="flex flex-row items-center gap-x-2">
                      <Image src={tab.iconUrl} width={30} height={30} alt="icon image" />
                      <p>{tab.title}</p>
                    </div>
                    
                  </CardContent>
                </Card>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
    </Sidebar>
  );
}