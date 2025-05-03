"use client"

import { Button } from "@/components/ui/button"
import { removeTokenCookieWithRedirect, getTokenPayload, type DecodedToken } from "../../utils/auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Home, Calendar, Users, Info, LogOut, Menu, X } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

import Image from "next/image"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"

interface FriendRequest {
  FriendID: number
  UserID: number
  Name: string
  Email: string
}

interface NavigationBarProps {
  hideNotification?: boolean
}

export default function NavigationBar({ hideNotification = false }: NavigationBarProps) {
  const [token, setToken] = useState<DecodedToken | null>(null)
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Fetch token on component mount
  useEffect(() => {
    async function fetchToken() {
      const payload = await getTokenPayload()
      if (!payload || payload === null) {
        router.push("/auth")
      } else {
        setToken(payload)
      }
    }
    fetchToken()
  }, [router])

  // Fetch friend requests when token is available
  useEffect(() => {
    async function fetchFriendRequests() {
      if (!token || !token.userId) return

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/friends/requests/${token.userId}`)
        if (!response.ok) throw new Error("Failed to retrieve incoming friend requests")

        const json = await response.json()
        setFriendRequests(json.data || [])
      } catch (error) {
        console.error("Error fetching friend requests:", error)
      }
    }

    if (token?.userId) {
      fetchFriendRequests()

      // Set up polling to check for new requests every 30 seconds
      const intervalId = setInterval(fetchFriendRequests, 30000)

      // Clean up interval on component unmount
      return () => clearInterval(intervalId)
    }
  }, [token])

  async function handleLogout() {
    await removeTokenCookieWithRedirect()
    router.push("/auth")
  }

  // Only show notification badge if not on own profile page and there are friend requests
  const showNotificationBadge = !hideNotification && friendRequests.length > 0

  const navItems = [
    { name: "Home", href: "/", icon: <Home className="h-4 w-4 mr-2" /> },
    { name: "Create Event", href: "/events/create", icon: <Calendar className="h-4 w-4 mr-2" /> },
    { name: "Discover", href: "/discover", icon: <Users className="h-4 w-4 mr-2" /> },
    { name: "About", href: "/about", icon: <Info className="h-4 w-4 mr-2" /> },
  ]

  return (
    <nav className="bg-gradient-to-r from-purple-800 to-purple-600 shadow-md">
      <div className="w-full px-2 sm:px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and company name - moved closer to left edge */}
          <div className="flex items-center pl-0">
            <Link href="/" className="flex items-center">
              <Image src="/companyLogo.png" alt="logo" width={40} height={40} className="rounded-md" />
              <span className="ml-2 text-xl font-bold text-white">Rendezvous</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors
                  ${
                    pathname === item.href
                      ? "bg-purple-900 text-white"
                      : "text-purple-100 hover:bg-purple-700 hover:text-white"
                  }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </div>

          {/* User actions - moved closer to right edge */}
          <div className="hidden md:flex md:items-center md:space-x-4 pr-0">
            {token ? (
              <Button onClick={handleLogout} className="bg-purple-700 text-white hover:bg-purple-900">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            ) : (
              <Button className="bg-purple-700 text-white hover:bg-purple-900" asChild>
                <Link href="/auth">Login</Link>
              </Button>
            )}

            {/* Profile icon with notification badge */}
            <div className="relative">
              <Link href={token?.userId ? `/users/${token.userId}` : "/profile"}>
                <Avatar className="h-9 w-9 border-2 border-white hover:border-purple-300 transition-all">
                  <AvatarImage src="/profileIcon.png" alt="Profile" />
                  <AvatarFallback className="bg-purple-100 text-purple-800">
                    {token?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>

                {/* Notification Badge - Only show if not on own profile */}
                {showNotificationBadge && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-purple-800 animate-pulse">
                    {friendRequests.length}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-purple-700">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="bg-gradient-to-b from-purple-800 to-purple-600 border-none text-white"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-6">
                    <Link href="/" className="flex items-center" onClick={() => setIsOpen(false)}>
                      <Image src="/companyLogo.png" alt="logo" width={32} height={32} className="rounded-md" />
                      <span className="ml-2 text-lg font-bold text-white">Rendezvous</span>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsOpen(false)}
                      className="text-white hover:bg-purple-700"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="space-y-3 mb-6">
                    {navItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                          ${
                            pathname === item.href
                              ? "bg-purple-900 text-white"
                              : "text-purple-100 hover:bg-purple-700 hover:text-white"
                          }`}
                      >
                        {item.icon}
                        {item.name}
                      </Link>
                    ))}
                  </div>

                  <div className="mt-auto space-y-4">
                    <div className="flex items-center">
                      <Link
                        href={token?.userId ? `/users/${token.userId}` : "/profile"}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center space-x-3"
                      >
                        <div className="relative">
                          <Avatar className="h-10 w-10 border-2 border-white">
                            <AvatarImage src="/profileIcon.png" alt="Profile" />
                            <AvatarFallback className="bg-purple-100 text-purple-800">
                              {token?.name?.charAt(0) || "U"}
                            </AvatarFallback>
                          </Avatar>

                          {/* Mobile Notification Badge - Only show if not on own profile */}
                          {showNotificationBadge && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-purple-800 animate-pulse">
                              {friendRequests.length}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">My Profile</p>
                          {showNotificationBadge && (
                            <p className="text-xs text-purple-200">
                              {friendRequests.length} friend request{friendRequests.length > 1 ? "s" : ""}
                            </p>
                          )}
                        </div>
                      </Link>
                    </div>

                    {token ? (
                      <Button
                        onClick={() => {
                          handleLogout()
                          setIsOpen(false)
                        }}
                        className="w-full bg-purple-700 text-white hover:bg-purple-900"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    ) : (
                      <Button
                        className="w-full bg-purple-700 text-white hover:bg-purple-900"
                        asChild
                        onClick={() => setIsOpen(false)}
                      >
                        <Link href="/auth">Login</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
