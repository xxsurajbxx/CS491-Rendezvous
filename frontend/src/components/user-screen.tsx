"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Users, Clock, MapPin, Mail, Info } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getTokenPayload } from "../../utils/auth"
import { VerifyPopup } from "@/features/verify/VerifyPopup";
import { toast } from "sonner";

interface User {
  UserID: number
  Name: string
  Username: string | null
  Email: string
  Address: string | null
  Description: string | null
}

interface Friend {
  FriendID: number
  UserID: number
  Name: string
  Username: string | null
  Email: string
  Address: string | null
  Since: string
}

interface Event {
  EventID: number
  EventName: string
  startDateTime: string
  endDateTime: string
  IsPublic: number
  RSVPStatus: string
  RSVPTimestamp: string
  EventState: string
}

interface ApiResponse {
  status: string
  data: {
    user: User
    events: Event[]
    friends: Friend[]
  }
}

interface FriendRequest {
  FriendID: number
  UserID: number
  Name: string
  Email: string
}

export default function UserScreen({ id }: { id: number }) {
  const { userId } = useParams<{ userId: string }>()
  const [userData, setUserData] = useState<User | null>(null)
  const [friends, setFriends] = useState<Friend[]>([])
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [friendStatus, setFriendStatus] = useState<string>("Pending")
  const [relationship, setRelationship] = useState<"Unfriend" | "Pending" | "Accept Friend Request" | "Add Friend">(
    "Add Friend",
  )
  const [friendId, setFriendId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // verify user account variable
  const [showPopup, setShowPopup] = useState<boolean>(false);

  // Check if user is viewing their own profile
  const isOwnProfile = id === Number(userId)

  async function fetchFriendRequests() {
    if (!isOwnProfile || !userId || !id) return
    try {
      const response = await fetch(`http://localhost:8080/api/friends/requests/${userId}`)
      if (!response.ok) throw new Error("Failed the retrieve incoming friend requests")
      const json = await response.json()
      setFriendRequests(json.data)
    } catch (error) {
      console.log(error)
    }
  }

  async function fetchRelationship() {
    if (!userId || !id || isOwnProfile) return
    try {
      const response = await fetch(`http://localhost:8080/api/friends/status?userId1=${id}&userId2=${userId}`)
      if (!response.ok) throw new Error("Failed to fetch relationship")
      const json = await response.json()

      setRelationship(json.friendStatus)
      setFriendStatus(json.friendStatus)
      if (json.friendId != null) {
        setFriendId(json.friendId)
      }
      console.log(json.friendStatus)
    } catch (error) {
      console.log(error)
    }
  }

  async function sendFriendRequest() {
    if (!userId || !id) return
    try {
      // if user is not verified they cannot send friend request
      const token = await getTokenPayload();
      if (!token) throw new Error("Error occurred while getting jwt token");
      if (!token.verified) {
        toast("Only verified users can send friend requests.")
        setShowPopup(true);
        throw new Error("User cannot send friend requests becuase they are not verified");
      }

      await fetch("http://localhost:8080/api/friends/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: id,
          friendId: userId,
        }),
      })
    } catch (error) {
      console.error(error)
    } finally {
      await fetchRelationship()
    }
  }

  const handleUnfollow = async (friendId: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/friends/delete/${friendId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      })
      if (!response.ok) throw new Error("Failed to fetch friend requests")
    } catch (error) {
      console.error("Error unfollowing friend:", error)
    } finally {
      await fetchRelationship()
    }
  }

  const handleFriendRequest = async (action: "accept" | "reject", friendId: number) => {
    console.log(friendId)
    try {
      // if user is not verified they cannot accept or reject friend requests
      const token = await getTokenPayload();
      if (!token) throw new Error("Error occurred while getting jwt token");
      if (!token.verified) {
        toast("Only verified users can accept or reject friend requests.");
        setShowPopup(true);
        throw new Error("User cannot accept or reject friend requests becuase they are not verified");
      }

      const response = await fetch(`http://localhost:8080/api/friends/respond/${friendId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })

      if (!response.ok) throw new Error("Failed to process the request")
    } catch (error) {
      console.error("Error processing friend request:", error)
    } finally {
      // Always update the friend requests list
      await fetchFriendRequests()

      // If accepting a friend request, also update the friends list
      if (action === "accept") {
        // Reuse the fetchUserData function to update friends list
        if (userId) {
          try {
            const response = await fetch(`http://localhost:8080/api/user/${userId}/data`)
            if (!response.ok) throw new Error("Failed to fetch user data")
            const json: ApiResponse = await response.json()
            setFriends(json.data.friends)
          } catch (error) {
            console.error("Error fetching updated friends list:", error)
          }
        }
      }

      // Update relationship status if not viewing own profile
      if (!isOwnProfile) {
        await fetchRelationship()
      }
    }
  }

  useEffect(() => {
    async function fetchUserData() {
      if (!userId) return
      setIsLoading(true)
      try {
        const response = await fetch(`http://localhost:8080/api/user/${userId}/data`)
        if (!response.ok) throw new Error("Failed to fetch user data")
        const json: ApiResponse = await response.json()
        setUserData(json.data.user)
        setFriends(json.data.friends)
        setEvents(json.data.events)
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
    if (!isOwnProfile) {
      fetchRelationship()
    }
  }, [userId, isOwnProfile])

  useEffect(() => {
    if (isOwnProfile) {
      fetchFriendRequests()
    }
  }, [userId, isOwnProfile])

  useEffect(() => {
    const filtered = events.filter((event) => {
      if (isOwnProfile) {
        return true
      }
      return event.IsPublic === 1 || friendStatus === "Unfriend"
    })
    setFilteredEvents(filtered)
  }, [events, friendStatus, isOwnProfile])

  // run for user verification popup window
  useEffect(() => {

    const checkUserVerification = async () => {
      const token = await getTokenPayload();
      if (!token) {
        console.error("No jwt token retrieved.");
        return;
      }
      if (!token.verified) {
        setShowPopup(true);
        console.log("User is not verified");
      }
    };

    checkUserVerification();
  }, [])

  if (isLoading) {
    return <ProfileSkeleton />
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-purple-800 mb-2">Profile Not Found</h2>
          <p className="text-gray-600">
            The user profile you&apos;re looking for doesn&apos;t exist or couldn&apos;t be loaded.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto my-8 px-4 sm:px-6">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-purple-700 to-purple-500"></div>
        <div className="px-6 py-5 sm:px-8 sm:py-6">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center">
              <Avatar className="h-20 w-20 border-4 border-white">
                <AvatarImage src="/profileIcon.png" alt={userData.Name} />
                <AvatarFallback className="bg-purple-100 text-purple-800 text-xl">
                  {userData.Name.split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="mt-4 sm:mt-0 sm:ml-5">
                <h1 className="text-2xl font-bold text-gray-900">{userData.Name}</h1>
                <div className="space-y-1 mt-2">
                  {userData.Username && (
                    <div className="flex items-center text-sm">
                      <span className="text-purple-600 font-medium">@{userData.Username}</span>
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-1 text-gray-500" />
                    {userData.Email}
                  </div>
                  {userData.Address && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                      {userData.Address}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Relationship Action Buttons - Only show if not viewing own profile */}
            {!isOwnProfile && (
              <div className="mt-6 sm:mt-0">
                {relationship === "Add Friend" && (
                  <Button onClick={sendFriendRequest} className="bg-purple-600 hover:bg-purple-700">
                    Add Friend
                  </Button>
                )}

                {relationship === "Pending" && (
                  <Badge variant="outline" className="text-yellow-600 border-yellow-300 bg-yellow-50 px-3 py-1">
                    Friend Request Pending
                  </Badge>
                )}

                {relationship === "Accept Friend Request" && friendId !== null && (
                  <div className="flex space-x-3">
                    <Button
                      onClick={() => handleFriendRequest("accept", friendId)}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Accept
                    </Button>
                    <Button
                      onClick={() => handleFriendRequest("reject", friendId)}
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:bg-gray-100"
                    >
                      Decline
                    </Button>
                  </div>
                )}

                {relationship === "Unfriend" && friendId !== null && (
                  <Button
                    onClick={() => handleUnfollow(friendId)}
                    variant="outline"
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    Unfriend
                  </Button>
                )}
              </div>
            )}

            {/* Show Edit Profile button when viewing own profile */}
            {isOwnProfile && (
              <div className="mt-6 sm:mt-0">
                <Link href="/profile">
                  <Button variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50">
                    Edit Profile
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {userData.Description && (
            <div className="mt-6 flex items-start">
              <Info className="h-5 w-5 mr-2 text-gray-500 flex-shrink-0 mt-0.5" />
              <p className="text-gray-600">{userData.Description}</p>
            </div>
          )}

          {isOwnProfile && friendRequests.length > 0 && (
            <div className="mt-6 border-t pt-4 border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Friend Requests</h3>
              <div className="grid gap-3">
                {friendRequests.map((request) => (
                  <div key={request.FriendID} className="flex items-center justify-between bg-purple-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback className="bg-purple-100 text-purple-800">
                          {request.Name.split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{request.Name}</p>
                        <p className="text-sm text-gray-600">{request.Email}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleFriendRequest("accept", request.FriendID)}
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        Accept
                      </Button>
                      <Button
                        onClick={() => handleFriendRequest("reject", request.FriendID)}
                        size="sm"
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-gray-100"
                      >
                        Decline
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs for Events and Friends */}
      <div className="mt-8">
        <Tabs defaultValue="events" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="events" className="text-base">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Events ({filteredEvents.length})
            </TabsTrigger>
            <TabsTrigger value="friends" className="text-base">
              <Users className="h-4 w-4 mr-2" />
              Friends ({friends.length})
            </TabsTrigger>
          </TabsList>

          {/* Events Tab */}
          <TabsContent value="events">
            {filteredEvents.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <CalendarIcon className="h-12 w-12 mx-auto text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No Events</h3>
                <p className="mt-2 text-sm text-gray-500">This user hasn&apos;t RSVP&apos;d to any events yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <Link href={`/events/${event.EventID}`} key={event.EventID} className="group">
                    <Card className="h-full overflow-hidden transition-all duration-200 hover:shadow-lg border-gray-200 hover:border-purple-300">
                      <CardContent className="p-0">
                        <div className="h-3 bg-gradient-to-r from-purple-600 to-purple-400"></div>
                        <div className="p-5">
                          <div className="flex justify-between items-start">
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
                              {event.EventName}
                            </h3>
                            <Badge
                              className={`
                                ${
                                  event.EventState === "Upcoming"
                                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                                    : event.EventState === "Ongoing"
                                      ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                      : "bg-red-100 text-red-800 hover:bg-red-100"
                                }
                              `}
                            >
                              {event.EventState}
                            </Badge>
                          </div>
                          <div className="mt-3 space-y-1">
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock className="h-4 w-4 mr-1 text-gray-500" />
                              <span>Start:&nbsp;</span>
                              {new Date(event.startDateTime).toLocaleString(undefined, {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock className="h-4 w-4 mr-1 text-gray-500" />
                              <span>End:&nbsp;</span>
                              {new Date(event.endDateTime).toLocaleString(undefined, {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Friends Tab */}
          <TabsContent value="friends">
            {friends.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <Users className="h-12 w-12 mx-auto text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No Friends</h3>
                <p className="mt-2 text-sm text-gray-500">This user hasn&apos;t added any friends yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {friends.map((friend) => (
                  <Link href={`/users/${friend.UserID}`} key={friend.FriendID} className="group">
                    <Card className="h-full overflow-hidden transition-all duration-200 hover:shadow-lg border-gray-200 hover:border-purple-300">
                      <CardContent className="p-5">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarFallback className="bg-purple-100 text-purple-800">
                              {friend.Name.split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
                              {friend.Name}
                            </h3>
                            <p className="text-sm text-gray-600">{friend.Email}</p>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500 flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-gray-400" />
                          Friends since{" "}
                          {new Date(friend.Since).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>


      {/* Verification popup window */}
      {showPopup && <VerifyPopup setShowPopup={setShowPopup} />}
    </div>
  )
}

function ProfileSkeleton() {
  return (
    <div className="max-w-6xl mx-auto my-8 px-4 sm:px-6">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-purple-700 to-purple-500"></div>
        <div className="px-6 py-5 sm:px-8 sm:py-6">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="mt-4 sm:mt-0 sm:ml-5">
                <Skeleton className="h-8 w-48" />
                <div className="space-y-1 mt-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-5 w-36" />
                </div>
              </div>
            </div>
            <div className="mt-6 sm:mt-0">
              <Skeleton className="h-10 w-28" />
            </div>
          </div>
          <div className="mt-6">
            <Skeleton className="h-4 w-full max-w-md" />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="grid grid-cols-2 gap-2 mb-8">
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      </div>
    </div>
  )
}
