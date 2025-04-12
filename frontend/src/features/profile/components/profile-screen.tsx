"use client"

import React from "react"

import NavigationBar from "@/components/navigation-bar"
import { EditProfileForm } from "./edit-profile-form"
// import { Popup } from "@/components/popup"
// import { ProfileCard } from "./profile-card"

export const ProfileScreen = () => {
  // const [isOpen, setIsOpen] = useState<boolean>(true);

  return(
    <div>
      <header>
        <NavigationBar />
      </header>
      <main className="h-screen flex items-center justify-center">
        <div className = "md:h-auto md:w-[420px]">
          <EditProfileForm />  
        </div>
        {/* {isOpen === true ? <Popup message="Profile information changed successfully." /> : null} */}
      </main>
    </div>
  )
}