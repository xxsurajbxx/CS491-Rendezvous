"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CalendarIcon,
  Clock,
  MapPin,
  User,
  Users,
  Car,
  Info,
  AlertCircle,
  Plus,
  X,
  LogOut,
  Trash2,
  Lock,
  Ticket,
  ExternalLink,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface FullDataResponse {
  event: Event
  host: Host
  rsvps: RSVP[]
  carpools: Carpool[]
}

interface Event {
  EventID: number
  Name: string
  startDateTime: string // ISO date string
  endDateTime: string // ISO date string
  Location: string
  Description: string | null
  IsPublic: number // 1 or 0
  HostUserID: number
  TicketmasterLink: string | null
  Latitude: string
  Longitude: string
  EventState: string
}

interface Host {
  UserID: number
  Name: string
  Username: string
  Email: string
  Address: string
  Description: string | null
}

interface RSVP {
  RSVP_ID: number
  UserID: number
  UserName: string
  RSVPTimestamp: string // ISO date string
  EventState: string
}

interface Carpool {
  CarpoolID: number
  EventID: number
  HostUserID: number
  HostName: string
  MaxSeats: number
  AvailableSeats: number
  Description: string
  participants: CarpoolParticipant[]
}

interface CarpoolParticipant {
  CarpoolID: number
  UserID: number
  UserName: string
}

export const EventScreen = ({ id }: { id: number }) => {
  const { eventId } = useParams<{ eventId: string }>()
  const [event, setEvent] = useState<Event | null>(null)
  const [host, setHost] = useState<Host | null>(null)
  const [rsvps, setRsvps] = useState<RSVP[]>([])
  const [myCarpool, setMyCarpool] = useState<Carpool | null>(null)
  const [friendsCarpools, setFriendsCarpools] = useState<Carpool[]>([])
  const [rsvpStatus, setRsvpStatus] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [carpoolSeats, setCarpoolSeats] = useState<number>(4)
  const [carpoolNotes, setCarpoolNotes] = useState<string>("")
  const [isCreateCarpoolOpen, setIsCreateCarpoolOpen] = useState<boolean>(false)
  const [hasAccess, setHasAccess] = useState<boolean>(false)
  const [accessChecked, setAccessChecked] = useState<boolean>(false)

  // Check if the user has access to view this event
  async function checkEventAccess() {
    try {
      if (!id || !eventId) return
      setIsLoading(true)

      // First get the event data
      await getEventData()

      // If event data couldn't be loaded, we'll exit in getEventData
      if (!event) return

      // Check if user is the host
      if (event.HostUserID === id) {
        setHasAccess(true)
        setAccessChecked(true)
        return
      }

      // Check if event is public
      if (event.IsPublic === 1) {
        setHasAccess(true)
        setAccessChecked(true)
        return
      }

      // Check if user and host are friends
      const response = await fetch(`http://localhost:8080/api/friends/status?userId1=${id}&userId2=${event.HostUserID}`)
      if (!response.ok) throw new Error("Failed to fetch relationship")

      const json = await response.json()

      // Set access based on friendship status
      setHasAccess(json.friendStatus === "Unfriend")
      setAccessChecked(true)
    } catch (error) {
      console.log(error)
      setError("Failed to check if you have access to this event.")
      setHasAccess(false)
      setAccessChecked(true)
    } finally {
      setIsLoading(false)
    }
  }

  async function getEventData() {
    try {
      if (!id || !eventId) return
      setError(null)
      const response = await fetch(`http://localhost:8080/api/events/full/${eventId}/${id}`)
      if (!response.ok) throw new Error("Failed to fetch event data")
      const json: FullDataResponse = await response.json()
      setEvent(json.event)
      setHost(json.host)
      setRsvps(json.rsvps)
      setFriendsCarpools(json.carpools)
    } catch (error) {
      console.log(error)
      setError("Failed to load event data. Please try again later.")
      // Don't set isLoading to false here, let checkEventAccess handle it
    }
  }

  useEffect(() => {
    if (!id || !eventId) return
    checkEventAccess()
    getRSVP()
    getCarpool()
  }, [id, eventId])

  // Function to determine if the user has rsvp'ed or not
  async function getRSVP() {
    try {
      if (!id || !eventId) return
      const response = await fetch(`http://localhost:8080/api/rsvp/status/${id}/${eventId}`)
      if (!response.ok) throw new Error("Failed to retrieve RSVP status")
      const json = await response.json()
      setRsvpStatus(json.rsvped)
    } catch (error) {
      console.log(error)
    }
  }

  // Function to RSVP to event
  async function rsvpToEvent() {
    try {
      if (!id || !eventId) return
      const response = await fetch("http://localhost:8080/api/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: id,
          eventId: eventId,
        }),
      })
      if (!response.ok) throw new Error("Failed to RSVP to event")
      setRsvpStatus(true)
      await getEventData()
    } catch (error) {
      console.log(error)
      setError("Failed to RSVP to event. Please try again.")
    }
  }

  // Function to unRSVP from event
  async function unrsvpFromEvent() {
    try {
      if (!id || !eventId) return
      const response = await fetch(`http://localhost:8080/api/rsvp/${id}/${eventId}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to unRSVP from this event")
      // This should also delete all carpool you are in or hosting
      setRsvpStatus(false)
      setMyCarpool(null)
      await getEventData()
    } catch (error) {
      console.log(error)
      setError("Failed to cancel your RSVP. Please try again.")
    }
  }

  // Function to see what carpool the user is currently in
  async function getCarpool() {
    try {
      if (!id || !eventId) return
      const response = await fetch(`http://localhost:8080/api/carpool/my/${id}/${eventId}`)
      if (!response.ok) throw new Error("Failed to find carpool user is in")
      const json = await response.json()
      setMyCarpool(json.carpool)
    } catch (error) {
      console.log(error)
      // Not being in a carpool is a valid state, so we don't set an error
      setMyCarpool(null)
    }
  }

  // Function to offer carpool
  async function makeCarpool() {
    try {
      if (!id || !eventId) return
      // Notes can be an empty string, this is fine
      const response = await fetch(`http://localhost:8080/api/carpool/offer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: id,
          eventId: eventId,
          maxSeats: carpoolSeats,
          notes: carpoolNotes,
        }),
      })
      if (!response.ok) throw new Error("Failed to make carpool")
      setIsCreateCarpoolOpen(false)
      await getCarpool()
      await getEventData()
    } catch (error) {
      console.log(error)
      setError("Failed to create carpool. Please try again.")
    }
  }

  // Function to delete carpool, this should only be used for carpools the user is hosting
  async function deleteCarpool(carpoolId: number) {
    try {
      if (!id) return
      const response = await fetch(`http://localhost:8080/api/carpool/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          carpoolId: carpoolId,
          userId: id,
        }),
      })
      if (!response.ok) throw new Error("Failed to delete carpool")
      setMyCarpool(null)
      await getEventData()
    } catch (error) {
      console.log(error)
      setError("Failed to delete carpool. Please try again.")
    }
  }

  // Function to join carpool
  async function joinCarpool(carpoolId: number) {
    try {
      if (!id) return
      const response = await fetch(`http://localhost:8080/api/carpool/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          carpoolId: carpoolId,
          userId: id,
        }),
      })
      if (!response.ok) throw new Error("Failed to join carpool")
      await getCarpool()
      await getEventData()
    } catch (error) {
      console.log(error)
      setError("Failed to join carpool. Please try again.")
    }
  }

  // Function to leave carpool, this should only be used for carpools that they joined, not ones they hosted
  async function leaveCarpool(carpoolId: number) {
    try {
      if (!id) return
      const response = await fetch(`http://localhost:8080/api/carpool/leave`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          carpoolId: carpoolId,
          userId: id,
        }),
      })
      if (!response.ok) throw new Error("Failed to leave carpool")
      setMyCarpool(null)
      await getEventData()
    } catch (error) {
      console.log(error)
      setError("Failed to leave carpool. Please try again.")
    }
  }

  // Function to remove user from carpool, aka kicking a user from a carpool
  async function kickUserFromCarpool(carpoolId: number, userId: number) {
    try {
      const response = await fetch(`http://localhost:8080/api/carpool/${carpoolId}/remove/${userId}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error(`Failed to kick user ${userId} from carpool`)
      await getCarpool()
      await getEventData()
    } catch (error) {
      console.log(error)
      setError("Failed to remove user from carpool. Please try again.")
    }
  }

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Check if user is hosting the carpool
  const isHostingCarpool = myCarpool && myCarpool.HostUserID === id

  // Check if user is the event host
  const isEventHost = event && id === event.HostUserID

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse space-y-4 w-full max-w-4xl">
          <div className="h-12 bg-gray-200 rounded-md w-3/4"></div>
          <div className="h-64 bg-gray-200 rounded-md"></div>
          <div className="h-32 bg-gray-200 rounded-md"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  // Show access denied message if the user doesn't have access
  if (accessChecked && !hasAccess) {
    return (
      <div className="max-w-6xl mx-auto my-8 px-4 sm:px-6">
        <div className="bg-white rounded-xl shadow-md overflow-hidden p-8 text-center">
          <Lock className="h-16 w-16 mx-auto text-purple-600 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            You don&apos;t have permission to view this event. This event might be private and only visible to the host and
            their friends.
          </p>
          <Button asChild className="bg-purple-600 hover:bg-purple-700">
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (!event || !host) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Event not found or you don&apos;t have permission to view it.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto my-8 px-4 sm:px-6">
      {/* Event Header */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-purple-700 to-purple-500"></div>
        <div className="px-6 py-5 sm:px-8 sm:py-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">{event.Name}</h1>
                <Badge
                  className={`ml-3 ${
                    event.EventState === "Upcoming"
                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                      : event.EventState === "Ongoing"
                        ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                        : "bg-red-100 text-red-800 hover:bg-red-100"
                  }`}
                >
                  {event.EventState}
                </Badge>
                <Badge className="ml-2 bg-purple-100 text-purple-800 hover:bg-purple-100" variant="outline">
                  {event.IsPublic === 1 ? "Public" : "Private"}
                </Badge>
                {isEventHost && (
                  <Badge className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-100">You&apos;re the host</Badge>
                )}
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center text-gray-600">
                  <CalendarIcon className="h-5 w-5 mr-2 text-purple-600" />
                  <span>Start: {formatDate(event.startDateTime)}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-2 text-purple-600" />
                  <span>End: {formatDate(event.endDateTime)}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-2 text-purple-600" />
                  <span>{event.Location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <User className="h-5 w-5 mr-2 text-purple-600" />
                  <span>
                    Hosted by:{" "}
                    <Link href={`/users/${host.UserID}`} className="text-purple-600 hover:underline">
                      {host.Name}
                    </Link>
                  </span>
                </div>
                {event.TicketmasterLink && (
                  <div className="flex items-center text-gray-600">
                    <Ticket className="h-5 w-5 mr-2 text-purple-600" />
                    <a
                      href={event.TicketmasterLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:underline flex items-center"
                    >
                      Buy tickets on Ticketmaster
                      <ExternalLink className="h-3.5 w-3.5 ml-1" />
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 md:mt-0">
              {!rsvpStatus ? (
                <Button onClick={rsvpToEvent} className="bg-purple-600 hover:bg-purple-700">
                  RSVP to Event
                </Button>
              ) : (
                <div className="space-y-3">
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100 px-3 py-1 text-sm">
                    You&apos;re attending
                  </Badge>
                  <Button
                    onClick={unrsvpFromEvent}
                    variant="outline"
                    className="border-red-300 text-red-600 hover:bg-red-50 w-full"
                  >
                    Cancel RSVP
                  </Button>
                </div>
              )}
            </div>
          </div>

          {event.Description && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-2">About this event</h3>
              <p className="text-gray-600 whitespace-pre-line">{event.Description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Tabs for Carpools and Attendees */}
      <div className="mt-8">
        <Tabs defaultValue="carpools" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="carpools" className="text-base">
              <Car className="h-4 w-4 mr-2" />
              Carpools
            </TabsTrigger>
            <TabsTrigger value="attendees" className="text-base">
              <Users className="h-4 w-4 mr-2" />
              Friends Attending ({rsvps.length})
            </TabsTrigger>
          </TabsList>

          {/* Carpools Tab */}
          <TabsContent value="carpools">
            {!rsvpStatus ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <Car className="h-12 w-12 mx-auto text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">RSVP to See Carpools</h3>
                <p className="mt-2 text-sm text-gray-500">You need to RSVP to this event to view or join carpools.</p>
                <Button onClick={rsvpToEvent} className="mt-4 bg-purple-600 hover:bg-purple-700">
                  RSVP to Event
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* My Carpool Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">My Carpool</h3>

                    {myCarpool ? (
                      <div className="bg-purple-50 rounded-lg p-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div>
                            <div className="flex items-center">
                              <h4 className="font-medium text-purple-900">
                                {isHostingCarpool ? "You are hosting this carpool" : `Hosted by ${myCarpool.HostName}`}
                              </h4>
                              {isHostingCarpool && <Badge className="ml-2 bg-purple-200 text-purple-800">Host</Badge>}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {myCarpool.AvailableSeats} of {myCarpool.MaxSeats} seats available
                            </p>
                            {myCarpool.Description && (
                              <p className="text-sm text-gray-700 mt-2 bg-white p-2 rounded border border-gray-200">
                                {myCarpool.Description}
                              </p>
                            )}
                          </div>

                          <div className="mt-4 md:mt-0">
                            {isHostingCarpool ? (
                              <Button
                                onClick={() => deleteCarpool(myCarpool.CarpoolID)}
                                variant="destructive"
                                size="sm"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete Carpool
                              </Button>
                            ) : (
                              <Button
                                onClick={() => leaveCarpool(myCarpool.CarpoolID)}
                                variant="outline"
                                size="sm"
                                className="border-red-300 text-red-600 hover:bg-red-50"
                              >
                                <LogOut className="h-4 w-4 mr-1" />
                                Leave Carpool
                              </Button>
                            )}
                          </div>
                        </div>

                        {/* Participants */}
                        <div className="mt-4 pt-4 border-t border-purple-200">
                          <h5 className="text-sm font-medium text-purple-900 mb-2">Participants</h5>
                          <div className="space-y-2">
                            {myCarpool.participants.map((participant) => (
                              <div
                                key={participant.UserID}
                                className="flex items-center justify-between bg-white p-2 rounded-md border border-gray-200"
                              >
                                <Link
                                  href={`/users/${participant.UserID}`}
                                  className="flex items-center hover:text-purple-700 transition-colors"
                                >
                                  <Avatar className="h-6 w-6 mr-2">
                                    <AvatarFallback className="bg-purple-100 text-purple-800 text-xs">
                                      {participant.UserName.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm">{participant.UserName}</span>
                                </Link>
                                {isHostingCarpool && participant.UserID !== id && (
                                  <Button
                                    onClick={() => kickUserFromCarpool(myCarpool.CarpoolID, participant.UserID)}
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <X className="h-4 w-4" />
                                    <span className="sr-only">Remove</span>
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <Car className="h-10 w-10 mx-auto text-gray-400" />
                        <h4 className="mt-2 text-base font-medium text-gray-900">You&apos;re not in a carpool yet</h4>
                        <p className="mt-1 text-sm text-gray-500">Join an existing carpool below or create your own.</p>
                        <Dialog open={isCreateCarpoolOpen} onOpenChange={setIsCreateCarpoolOpen}>
                          <DialogTrigger asChild>
                            <Button className="mt-4 bg-purple-600 hover:bg-purple-700">
                              <Plus className="h-4 w-4 mr-1" />
                              Offer a Carpool
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Create a Carpool</DialogTitle>
                              <DialogDescription>
                                Offer a ride to other attendees. Fill out the details below.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="seats" className="text-right">
                                  Seats
                                </Label>
                                <Input
                                  id="seats"
                                  type="number"
                                  min="1"
                                  max="10"
                                  value={carpoolSeats}
                                  onChange={(e) => setCarpoolSeats(Number.parseInt(e.target.value))}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="notes" className="text-right">
                                  Notes
                                </Label>
                                <Textarea
                                  id="notes"
                                  placeholder="Add any details about pickup location, timing, etc."
                                  value={carpoolNotes}
                                  onChange={(e) => setCarpoolNotes(e.target.value)}
                                  className="col-span-3"
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setIsCreateCarpoolOpen(false)}>
                                Cancel
                              </Button>
                              <Button onClick={makeCarpool} className="bg-purple-600 hover:bg-purple-700">
                                Create Carpool
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}
                  </div>
                </div>

                {/* Available Carpools Section */}
                {!myCarpool && friendsCarpools.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-5">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Carpools</h3>
                      <div className="grid gap-4 sm:grid-cols-2">
                        {friendsCarpools
                          .filter((carpool) => carpool.AvailableSeats > 0)
                          .map((carpool) => (
                            <Card key={carpool.CarpoolID} className="overflow-hidden">
                              <CardHeader className="bg-purple-50 pb-3">
                                <CardTitle className="text-base font-medium">Hosted by {carpool.HostName}</CardTitle>
                                <CardDescription>
                                  {carpool.AvailableSeats} of {carpool.MaxSeats} seats available
                                </CardDescription>
                              </CardHeader>
                              <CardContent className="pt-4">
                                {carpool.Description && <p className="text-sm text-gray-600">{carpool.Description}</p>}
                                {carpool.participants.length > 0 && (
                                  <div className="mt-3">
                                    <p className="text-xs text-gray-500 mb-1">Participants:</p>
                                    <div className="flex flex-wrap gap-1">
                                      {carpool.participants.map((participant) => (
                                        <Badge
                                          key={participant.UserID}
                                          variant="outline"
                                          className="bg-gray-100 text-gray-700"
                                        >
                                          {participant.UserName}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </CardContent>
                              <CardFooter className="bg-gray-50 border-t">
                                <Button
                                  onClick={() => joinCarpool(carpool.CarpoolID)}
                                  className="w-full bg-purple-600 hover:bg-purple-700"
                                >
                                  Join Carpool
                                </Button>
                              </CardFooter>
                            </Card>
                          ))}
                      </div>

                      {friendsCarpools.filter((carpool) => carpool.AvailableSeats > 0).length === 0 && (
                        <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                          <Info className="h-8 w-8 mx-auto text-gray-400" />
                          <p className="mt-2 text-sm text-gray-500">No available carpools at the moment.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* Attendees Tab */}
          <TabsContent value="attendees">
            {rsvps.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <Users className="h-12 w-12 mx-auto text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No Friends Attending Yet</h3>
                <p className="mt-2 text-sm text-gray-500">None of your friends have RSVP&apos;d to this event yet.</p>
                {!rsvpStatus && (
                  <Button onClick={rsvpToEvent} className="mt-4 bg-purple-600 hover:bg-purple-700">
                    RSVP to Event
                  </Button>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Friends Attending ({rsvps.length})</h3>
                  <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                    {rsvps.map((rsvp) => (
                      <Link
                        href={`/users/${rsvp.UserID}`}
                        key={rsvp.RSVP_ID}
                        className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-purple-300 transition-all"
                      >
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarFallback className="bg-purple-100 text-purple-800">
                            {rsvp.UserName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900 group-hover:text-purple-700">{rsvp.UserName}</p>
                          <p className="text-xs text-gray-500">
                            RSVP&apos;d{" "}
                            {new Date(rsvp.RSVPTimestamp).toLocaleString(undefined, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
