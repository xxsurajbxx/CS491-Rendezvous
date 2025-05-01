"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Clock, MapPin, ArrowRight, CheckCircle, Crown } from "lucide-react"
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
  endDateTime,
  attending,
  isHost,
}) => {
  const router = useRouter()
  const [attendingStatus, setAttendingStatus] = useState<boolean>(attending) // Hosts are always attending
  const [isLoading, setIsLoading] = useState(false)

  const navigateToEvent = () => {
    router.push(`events/${EventID}`)
  }

  const formatDate = (dateTime: Date) => {
    return dayjs(dateTime).format("MMM D, YYYY")
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
      className="overflow-hidden transition-all duration-300 hover:shadow-md group border border-purple-100"
    >
      <div className="flex">
        {/* Date Column */}
        <div className="bg-purple-900 text-white p-2 flex flex-col items-center justify-center w-16">
          <div className="text-xs font-medium">{formatDayOfWeek(startDateTime)}</div>
          <div className="text-2xl font-bold">{formatDay(startDateTime)}</div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <CardContent className="p-3 pb-0">
            {/* Event Header - Clickable */}
            <div onClick={navigateToEvent} className="cursor-pointer group/title mb-3">
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-semibold text-gray-900 group-hover/title:text-purple-800 transition-colors duration-200">
                  {Name}
                </h3>
                <ArrowRight className="h-3.5 w-3.5 text-purple-700 opacity-0 group-hover/title:opacity-100 transition-opacity duration-200 flex-shrink-0 ml-1" />
              </div>
              <p className="text-xs text-gray-500 mt-1.5 line-clamp-3">{Description}</p>
            </div>

            {/* Event Details */}
            <div className="space-y-2.5 text-xs">
              {/* Time Section */}
              <div className="flex items-start">
                <Clock className="h-3.5 w-3.5 text-purple-700 mr-2 mt-0.5 flex-shrink-0" />
                <div className="space-y-0.5">
                  <div className="text-gray-700">
                    <span className="font-medium">Start:</span> {formatDate(startDateTime)} at{" "}
                    {formatTime(startDateTime)}
                  </div>
                  {endDateTime && (
                    <div className="text-gray-700">
                      <span className="font-medium">End:</span> {formatDate(endDateTime)} at {formatTime(endDateTime)}
                    </div>
                  )}
                </div>
              </div>

              {/* Location Section - No line clamp */}
              <div className="flex items-start pb-2">
                <MapPin className="h-3.5 w-3.5 text-purple-700 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 break-words">{Location}</span>
              </div>
            </div>
          </CardContent>

          {/* RSVP Section */}
          <CardFooter className="p-3 pt-2 border-t border-gray-100">
            {isHost ? (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <Crown className="h-3.5 w-3.5 text-amber-500 mr-1.5" />
                  <span className="text-xs font-medium text-amber-700">You&apos;re hosting this event</span>
                </div>
              </div>
            ) : attendingStatus ? (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <CheckCircle className="h-3.5 w-3.5 text-green-600 mr-1.5" />
                  <span className="text-xs font-medium text-green-700">Attending</span>
                </div>
                <Button
                  onClick={handleCancelRsvp}
                  variant="outline"
                  size="sm"
                  disabled={isLoading}
                  className="h-7 text-xs border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleEventRsvp}
                size="sm"
                className="w-full h-7 text-xs bg-purple-700 hover:bg-purple-800 text-white"
                disabled={isLoading}
              >
                RSVP to Event
              </Button>
            )}
          </CardFooter>
        </div>
      </div>
    </Card>
  )
}
