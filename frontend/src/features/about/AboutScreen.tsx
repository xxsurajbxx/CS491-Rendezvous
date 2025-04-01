"use client"

import React from "react"

import NavigationBar from "@/components/navigation-bar"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export const AboutScreen = () => {

  return(
    <div className="h-screen w-screen">
      <header>
        <NavigationBar />
      </header>
      <main className="h-fit w-full p-5">
        <div className="flex flex-row h-full w-full items-center my-[100px]">
          <div className="flex flex-col h-full w-1/2 items-center justify-center space-y-7 text-center">
            <h2 className="w-1/2 font-semibold text-2xl">{aboutUsInfo.info_1}</h2>
            <p className="w-1/2">{aboutUsInfo.info_2}</p>
            <Button asChild className="w-1/3 h-[60px] bg-purple-900 text-xl">
              <Link href="/">Start Looking</Link>
            </Button>
          </div>
          <div className="flex flex-col w-1/2 h-full justify-center items-center">
            <Image src="/cityImage.png" alt="photo" width={600} height={100} className="rounded-md" />
          </div>
        </div>
      </main>
      <footer className="w-full h-fit p-4 bg-[#8e7bb2]">
        <div className="flex flex-row items-center justify-evenly">
          {footerInfo.map((item, index) => (
            <div key={index} className="flex flex-col items-center w-[200px] text-center space-y-2">
              <Image src={item.imagePath} alt="icon" width={90} height={90} />
              <h3 className="text-2xl font-semibold">{item.title}</h3>
              <p>{item.info}</p>
            </div>
          ))}
        </div>
      </footer>
    </div>
  )
}

const aboutUsInfo = {
  info_1: "The Easiest Way To Plan Your Next Outing.",
  info_2: "Search Events, invite friends, navigate city life. All your future plans begin here.",
  info_3: "",
  info_4: "",
}

const footerInfo = [
  {
    title: "Easy To Use",
    info: "City Traveling is an all-inclusive event planner. Providing all the necessary details to you about the event.",
    imagePath: "/lightbulb.png"
  },
  {
    title: "Plan Events With Friends",
    info: "View which of your friends are going to an event or start  your own event!",
    imagePath: "/friendsIcon.png"
  },
  {
    title: "Map And Budget Your Travels",
    info: "City traveling will provide navigation to your event including train lines and other travel details.",
    imagePath: "/map.png"
  }
]