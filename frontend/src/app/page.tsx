"use client"

import NavigationBar from "@/components/navigation-bar";
import dynamic from "next/dynamic";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { EventSideBar } from "@/features/events/components/event-sidebar";
import { getTokenPayload } from "../../utils/auth";
import { redirect } from "next/navigation";

// Token check and redirect (from feature/login)
const token = getTokenPayload();
if (!token) {
  redirect("/auth");
}

// Dynamically load LeafletMap
const LeafletMap = dynamic(() => import('../components/leaflet-map'), {
  ssr: false
});

export default function Home() {
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
