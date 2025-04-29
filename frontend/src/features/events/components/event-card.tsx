"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar, Clock, MapPin, ArrowRight } from "lucide-react"
import dayjs from "dayjs"
import { getTokenPayload } from "../../../../utils/auth"
import type { EventCardData } from "../types"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export const EventCard: React.FC<EventCardData> = ({
  EventID,
  Name,
  Description,
  Location,
  startDateTime,
  attending,
}) => {
  const router = useRouter()
  const [attendingStatus, setAttendingStatus] = useState<boolean>(attending)
  const [isLoading, setIsLoading] = useState(false)

  const navigateToEvent = () => {
    router.push(`events/${EventID}`)
  }

  const formatDate = (dateString: Date) => {
    return dayjs(dateString).format("MMMM D, YYYY")
  }

  const formatTime = (dateTime: Date) => {
    return dayjs(dateTime).format("h:mm A")
  }

  const formatDayOfWeek = (dateTime: Date) => {
    return dayjs(dateTime).format("ddd")
  }

  const formatDay = (dateTime: Date) => {
    return dayjs(dateTime).format("D")
  }

  const handleEventRsvp = async () => {
    try {
      setIsLoading(true)
      const token = await getTokenPayload()
      if (!token) throw new Error("Failed to retrieve token from cookies.")

      const response = await fetch(`http://localhost:8080/api/rsvp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: token?.userId,
          eventId: EventID,
        }),
      })
      if (!response.ok) throw new Error("Failed to post event rsvp request.")
      setAttendingStatus(true)
      toast.success("Successfully RSVP'd for event.")
    } catch (error) {
      console.error("Error rsvping for event.", error)
      toast.error("Failed to RSVP for event.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelRsvp = async () => {
    try {
      setIsLoading(true)
      const token = await getTokenPayload()
      if (!token) throw new Error("Failed to retrieve token from cookies.")

      const response = await fetch(`http://localhost:8080/api/rsvp/${token.userId}/${EventID}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to cancel RSVP.")

      if (response.status === 200) {
        setAttendingStatus(false)
        toast.success("Successfully UnRSVP'd from event.")
      }
    } catch (error) {
      console.error(error)
      toast.error("Failed to UnRSVP from event.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card
      id={"event-card-" + EventID}
      className="overflow-hidden transition-all duration-300 hover:shadow-lg group border-0 shadow-md"
    >
      <div className="flex flex-col md:flex-row">
        {/* Date Column */}
        <div className="bg-purple-900 text-white p-4 flex flex-row md:flex-col items-center justify-center md:w-24 md:min-w-24">
          <div className="text-center">
            <div className="text-sm font-medium">{formatDayOfWeek(startDateTime)}</div>
            <div className="text-3xl font-bold">{formatDay(startDateTime)}</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Event Header - Clickable */}
          <div
            onClick={navigateToEvent}
            className="p-5 cursor-pointer group-hover:bg-purple-50 transition-colors duration-300 border-b border-gray-100"
          >
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-bold text-gray-900 group-hover:text-purple-900 transition-colors duration-300">
                {Name}
              </h2>
              <ArrowRight className="h-5 w-5 text-purple-700 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1" />
            </div>
            <p className="mt-2 text-gray-600 line-clamp-2">{Description}</p>
          </div>

          {/* Event Details */}
          <div className="p-5 bg-white flex-1">
            <div className="space-y-3">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-purple-700 mr-2" />
                <span className="text-sm text-gray-700">{formatDate(startDateTime)}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-purple-700 mr-2" />
                <span className="text-sm text-gray-700">{formatTime(startDateTime)}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-purple-700 mr-2" />
                <span className="text-sm text-gray-700">{Location}</span>
              </div>
            </div>
          </div>

          {/* RSVP Button */}
          <div className="p-5 bg-gray-50 border-t border-gray-100">
            {attendingStatus ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm font-medium text-green-700">You&apos;re attending</span>
                </div>
                <Button
                  onClick={handleCancelRsvp}
                  variant="outline"
                  size="sm"
                  disabled={isLoading}
                  className="border-gray-300 text-gray-700 hover:bg-gray-200 hover:text-gray-900"
                >
                  Cancel RSVP
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleEventRsvp}
                className="w-full bg-purple-900 hover:bg-purple-800 text-white transition-colors duration-200"
                disabled={isLoading}
              >
                RSVP to Event
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
