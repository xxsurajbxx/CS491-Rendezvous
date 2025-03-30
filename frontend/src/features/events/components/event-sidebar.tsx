import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar"

import { EventCard } from "./event-card";
import { SidebarProps } from "../types";
import { Accordion } from "@radix-ui/react-accordion";

export const EventSideBar = ({ events, openEventCards, setOpenEventCards, isOpen }: SidebarProps) => {
  
  return(
    <Sidebar variant="inset" collapsible="none" className="w-1/4 max-h-screen top-[80px]">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xl py-7">Events</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-4">
              <Accordion type="multiple" value={openEventCards} onValueChange={setOpenEventCards} className="flex flex-col gap-y-2">
                {events && events.map((event, index) => (
                  <EventCard
                    key={index}
                    EventID={event.EventID}
                    Name={event.Name}
                    Description={event.Description}
                    Location={event.Location}
                    startDateTime={event.startDateTime}
                    endDateTime={event.endDateTime}
                    people={event.people}
                    isOpen={isOpen}
                  />
                ))}
              </Accordion>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}