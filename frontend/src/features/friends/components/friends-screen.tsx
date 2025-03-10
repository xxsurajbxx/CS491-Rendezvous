"use client"

import NavigationBar from "@/components/navigation-bar";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { FriendsSideBar } from "./sidebar";

export const FriendsScreen = () => {

  return(
    <div>
      <header>
        <NavigationBar />
      </header>
      <SidebarProvider>
        <FriendsSideBar />
        <SidebarInset>
          <main className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
            <p>hello from friends page !!!</p>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}