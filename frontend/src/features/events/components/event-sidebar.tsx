import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar"

import { EventCard } from "./event-card";

export const EventSideBar = () => {
  const events = [
    {
      title: 'Prudential Live',
      date: "April 9",
      description: "Cool event happening at Prudential. Bunch of bands playing here.",
      where: "25 Lafayette St, Newark, NJ 07102",
      startTime: "9:00pm",
      endTime: "12:00am",
      people: [
        "Danny Arco",
        "Chad Vincento",
        "Minny Palabi",
        "Marc Hamilton",
      ]
    },
    {
      title: 'Prudential Live',
      date: "April 9",
      description: "Cool event happening at Prudential. Bunch of bands playing here.",
      where: "25 Lafayette St, Newark, NJ 07102",
      startTime: "9:00pm",
      endTime: "12:00am",
      people: [
        "Danny Arco",
        "Chad Vincento",
        "Minny Palabi",
        "Marc Hamilton",
      ]
    },
    {
      title: 'Prudential Live',
      date: "April 9",
      description: "Cool event happening at Prudential. Bunch of bands playing here.",
      where: "25 Lafayette St, Newark, NJ 07102",
      startTime: "9:00pm",
      endTime: "12:00am",
      people: [
        "Danny Arco",
        "Chad Vincento",
        "Minny Palabi",
        "Marc Hamilton",
      ]
    },
    {
      title: 'Prudential Live',
      date: "April 9",
      description: "Cool event happening at Prudential. Bunch of bands playing here.",
      where: "25 Lafayette St, Newark, NJ 07102",
      startTime: "9:00pm",
      endTime: "12:00am",
      people: [
        "Danny Arco",
        "Chad Vincento",
        "Minny Palabi",
        "Marc Hamilton",
      ]
    },
  ]
  
  return(
    <Sidebar variant="inset" collapsible="none" className="w-1/4 max-h-screen top-[80px]">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xl py-7">Events</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-4">
              {events.map((event, index) => (
                <EventCard
                  key={index}
                  title={event.title}
                  date={event.date}
                  description={event.description}
                  where={event.where}
                  startTime={event.startTime}
                  endTime={event.endTime}
                  people={event.people}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}