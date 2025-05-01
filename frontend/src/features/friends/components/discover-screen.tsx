"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { UserPlus, UserCheck, Calendar, Users, ChevronDown, ChevronUp, SearchX, Mail, AtSign } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface DiscoverProps {
  id: number
}

// for recommended events
interface RSVP {
  EventID: number
  EventName: string
  StartDateTime: string
  EndDateTime: string
  Location: string
  Description: string
  FriendName: string
  FriendEmail: string
}

// Grouped event with attending friends
interface GroupedEvent {
  EventID: number
  EventName: string
  StartDateTime: string
  EndDateTime: string
  Location: string
  Description: string
  AttendingFriends: { name: string; email: string }[]
}

// for searching for users
interface User {
  UserID: number
  Name: string
  Username: string | null
  Email: string
}

// for recommended users
interface Recommendation {
  UserID: number
  Name: string
  Username: string
  Email: string
}

export const DiscoverScreen = ({ id }: DiscoverProps) => {
  //const [rsvps, setRsvps] = useState<RSVP[]>([])
  const [groupedEvents, setGroupedEvents] = useState<GroupedEvent[]>([])
  const [query, setQuery] = useState<string>("")
  const [users, setUsers] = useState<User[]>([])
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [pendingRequests, setPendingRequests] = useState<Set<number>>(new Set())
  const [isSearching, setIsSearching] = useState(false)
  const [expandedEvents, setExpandedEvents] = useState<Set<number>>(new Set())
  const [hasSearched, setHasSearched] = useState(false)

  async function sendFriendRequest(otherUserId: number) {
    if (!otherUserId || !id) return
    try {
      const response = await fetch("http://localhost:8080/api/friends/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: id,
          friendId: otherUserId,
        }),
      })

      if (response.ok) {
        // Add to pending requests
        setPendingRequests((prev) => new Set([...prev, otherUserId]))
      }
    } catch (error) {
      console.error(error)
    }
  }

  async function searchUser() {
    if (!query.trim()) {
      setUsers([])
      setHasSearched(false)
      return
    }

    setIsSearching(true)
    setHasSearched(true)

    try {
      if (!id) return
      const response = await fetch(`http://localhost:8080/api/friends/search?query=${encodeURIComponent(query)}`)
      if (!response.ok) throw new Error("Failed to search users")
      const json = await response.json()
      setUsers(json.data || [])
    } catch (error) {
      console.log(error)
      setUsers([])
    } finally {
      setIsSearching(false)
    }
  }

  async function getRecommendations() {
    try {
      if (!id) return
      const response = await fetch(`http://localhost:8080/api/friends/recommendations/${id}`)
      if (!response.ok) throw new Error("Failed to fetch recommendations")
      const json = await response.json()
      setRecommendations(json.recommendations || [])
    } catch (error) {
      console.log(error)
    }
  }

  async function getFriendsRSVPFeed() {
    try {
      if (!id) return
      const response = await fetch(`http://localhost:8080/api/rsvp/friends/${id}/rsvps`)
      if (!response.ok) throw new Error("Failed to fetch friends' RSVPs")
      const json = await response.json()
      //setRsvps(json.data || [])

      // Group RSVPs by event
      groupRSVPsByEvent(json.data || [])
    } catch (error) {
      console.log(error)
    }
  }

  // Group RSVPs by event to remove duplicates
  const groupRSVPsByEvent = (rsvpData: RSVP[]) => {
    const eventMap = new Map<number, GroupedEvent>()

    rsvpData.forEach((rsvp) => {
      if (!eventMap.has(rsvp.EventID)) {
        // Create new event entry
        eventMap.set(rsvp.EventID, {
          EventID: rsvp.EventID,
          EventName: rsvp.EventName,
          StartDateTime: rsvp.StartDateTime,
          EndDateTime: rsvp.EndDateTime,
          Location: rsvp.Location,
          Description: rsvp.Description,
          AttendingFriends: [{ name: rsvp.FriendName, email: rsvp.FriendEmail }],
        })
      } else {
        // Add friend to existing event
        const event = eventMap.get(rsvp.EventID)!
        event.AttendingFriends.push({ name: rsvp.FriendName, email: rsvp.FriendEmail })
      }
    })

    // Convert map to array
    setGroupedEvents(Array.from(eventMap.values()))
  }

  // Format date for event display
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Toggle expanded state for an event
  const toggleEventExpanded = (eventId: number) => {
    setExpandedEvents((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(eventId)) {
        newSet.delete(eventId)
      } else {
        newSet.add(eventId)
      }
      return newSet
    })
  }

  useEffect(() => {
    getFriendsRSVPFeed()
    getRecommendations()
  }, [])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim()) {
        searchUser()
      } else {
        setUsers([])
        setHasSearched(false)
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [query])

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-purple-800 mb-6">Discover</h1>

        <Tabs defaultValue="people" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="people" className="text-lg">
              <Users className="mr-2 h-5 w-5" />
              People
            </TabsTrigger>
            <TabsTrigger value="events" className="text-lg">
              <Calendar className="mr-2 h-5 w-5" />
              Events
            </TabsTrigger>
          </TabsList>

          <TabsContent value="people" className="space-y-8">
            {/* Search Section */}
            <Card>
              <CardHeader>
                <CardTitle>Find People</CardTitle>
                <CardDescription>Connect with friends and colleagues</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      placeholder="Search for users..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="pr-10"
                    />
                    {isSearching && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="animate-spin h-5 w-5 border-2 border-purple-500 rounded-full border-t-transparent"></div>
                      </div>
                    )}
                  </div>
                </div>

                {/* No results message */}
                {hasSearched && users.length === 0 && !isSearching && (
                  <div className="mt-4 text-center py-8 border rounded-lg bg-gray-50">
                    <SearchX className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-gray-500 font-medium">No users found</p>
                    <p className="text-gray-400 text-sm mt-1">Try a different search term</p>
                  </div>
                )}
              </CardContent>

              {users.length > 0 && (
                <CardFooter className="flex flex-col">
                  <div className="w-full border-t pt-4">
                    <h3 className="font-medium mb-2">Search Results</h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {users.map((user) => (
                        <Link href={`/users/${user.UserID}`} key={user.UserID}>
                          <div className="flex items-center p-3 rounded-lg border hover:bg-purple-50 transition-colors">
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarFallback className="bg-purple-200 text-purple-700">
                                {user.Name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.Name}</p>
                              {user.Username && (
                                <p className="text-sm text-purple-600 flex items-center">
                                  <AtSign className="h-3 w-3 mr-1" />
                                  {user.Username}
                                </p>
                              )}
                              <p className="text-sm text-gray-500 flex items-center">
                                <Mail className="h-3 w-3 mr-1" />
                                {user.Email}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </CardFooter>
              )}
            </Card>

            {/* Recommended Friends Section */}
            <Card>
              <CardHeader>
                <CardTitle>Recommended Friends</CardTitle>
                <CardDescription>Expand your social circle</CardDescription>
              </CardHeader>
              <CardContent>
                {recommendations.length === 0 ? (
                  <p className="text-center py-6 text-gray-500">No recommendations available at the moment</p>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {recommendations.map((recommendation) => (
                      <div key={recommendation.UserID} className="flex flex-col p-4 rounded-lg border">
                        <div className="flex items-center mb-3">
                          <Avatar className="h-12 w-12 mr-3">
                            <AvatarFallback className="bg-purple-200 text-purple-700">
                              {recommendation.Name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <Link href={`/users/${recommendation.UserID}`}>
                              <p className="font-medium hover:text-purple-700">{recommendation.Name}</p>
                            </Link>
                            {recommendation.Username && (
                              <p className="text-sm text-purple-600 flex items-center">
                                <AtSign className="h-3 w-3 mr-1" />
                                {recommendation.Username}
                              </p>
                            )}
                            <p className="text-sm text-gray-500 flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {recommendation.Email}
                            </p>
                          </div>
                        </div>

                        <div className="mt-auto pt-2">
                          {pendingRequests.has(recommendation.UserID) ? (
                            <Button variant="outline" className="w-full" disabled>
                              <UserCheck className="h-4 w-4 mr-2" />
                              Request Sent
                            </Button>
                          ) : (
                            <Button
                              onClick={() => sendFriendRequest(recommendation.UserID)}
                              className="w-full bg-purple-700 hover:bg-purple-800"
                            >
                              <UserPlus className="h-4 w-4 mr-2" />
                              Add Friend
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Events</CardTitle>
                <CardDescription>See what&apos;s happening in your network</CardDescription>
              </CardHeader>
              <CardContent>
                {groupedEvents.length === 0 ? (
                  <p className="text-center py-6 text-gray-500">No events from friends yet</p>
                ) : (
                  <div className="grid gap-4">
                    {groupedEvents.map((event) => (
                      <div
                        key={event.EventID}
                        className="rounded-lg border hover:border-purple-300 hover:shadow-sm transition-all overflow-hidden"
                      >
                        <Link href={`/events/${event.EventID}`} className="block p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-lg text-purple-800">{event.EventName}</h3>
                          </div>

                          <div className="text-sm text-gray-600 space-y-1">
                            <p>
                              <span className="font-medium">Starts: </span>
                              {formatEventDate(event.StartDateTime)}
                            </p>
                            <p>
                              <span className="font-medium">Ends: </span>
                              {formatEventDate(event.EndDateTime)}
                            </p>
                            {event.Location && (
                              <p>
                                <span className="font-medium">Location: </span>
                                {event.Location}
                              </p>
                            )}
                          </div>

                          {event.Description && (
                            <p className="text-sm text-gray-700 my-3 line-clamp-2">{event.Description}</p>
                          )}
                        </Link>

                        <Collapsible className="border-t bg-gray-50 px-4 py-2" open={expandedEvents.has(event.EventID)}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="flex -space-x-2 mr-2">
                                {event.AttendingFriends.slice(0, 3).map((friend, idx) => (
                                  <Avatar key={`${event.EventID}-${idx}`} className="h-6 w-6 border-2 border-white">
                                    <AvatarFallback className="bg-purple-200 text-purple-700 text-xs">
                                      {friend.name.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                ))}
                              </div>
                              <span className="text-sm text-gray-600">
                                {event.AttendingFriends.length === 1
                                  ? `${event.AttendingFriends[0].name} is attending`
                                  : `${event.AttendingFriends.length} friends attending`}
                              </span>
                            </div>

                            <CollapsibleTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="p-0 h-8 w-8"
                                onClick={() => toggleEventExpanded(event.EventID)}
                              >
                                {expandedEvents.has(event.EventID) ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                                <span className="sr-only">
                                  {expandedEvents.has(event.EventID) ? "Show less" : "Show more"}
                                </span>
                              </Button>
                            </CollapsibleTrigger>
                          </div>

                          <CollapsibleContent>
                            <div className="pt-2 pb-1">
                              <p className="text-sm font-medium text-gray-700 mb-2">Attending:</p>
                              <div className="grid gap-1">
                                {event.AttendingFriends.map((friend, idx) => (
                                  <div key={`${event.EventID}-full-${idx}`} className="flex items-center">
                                    <Avatar className="h-5 w-5 mr-2">
                                      <AvatarFallback className="bg-purple-200 text-purple-700 text-xs">
                                        {friend.name.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm text-gray-600">{friend.name}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
