"use client"

import React from "react"

import NavigationBar from "@/components/navigation-bar"
import { EditProfileForm } from "./edit-profile-form"

export const ProfileScreen = () => {

  return(
    <div>
      <header>
        <NavigationBar />
      </header>
      <main className="h-screen flex items-center justify-center">
        <div className = "md:h-auto md:w-[420px]">
          <EditProfileForm />  
        </div>
      </main>
    </div>
  )
}