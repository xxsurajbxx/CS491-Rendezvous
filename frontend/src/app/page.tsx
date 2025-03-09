"use client"

import NavigationBar from "@/components/navigation-bar";
import dynamic from "next/dynamic";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { EventSideBar } from "@/features/events/components/event-sidebar";

export default function Home() {
  //dynamically loaded leaflet map
  const LeafletMap = dynamic(
    () => import('../components/leaflet-map'), {
      ssr: false
  });

  return (
    <div>
      <header>
        <NavigationBar />
      </header>
      <SidebarProvider>
        <EventSideBar />
        <SidebarInset>
          <main className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
            <LeafletMap />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

