/**
 * Main component for the Navigation Bar used on majority of the pages for City Traveling app.
 */
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuViewport
} from "@/components/ui/navigation-menu"

import Image from "next/image";
import Link from "next/link";


const navigationItems = [
  {
    title: "Item one",
    href: "#",
  },
  {
    title: "Item two",
    href: "#",
  },
  {
    title: "Sign Up",
    href: "#",
  },
]


export default function NavigationBar(){

  return(
    <NavigationMenu className="bg-purple-900 h-20">
      <NavigationMenuList className="flex justify-between w-screen px-7">
        <div className="flex flex-row items-center">
          {/* Company logo and Company Name */}
          <Button className="bg-inherit hover:bg-inherit shadow-none">
            <Link href="/">
              <NavigationMenuItem className="flex flex-row items-center gap-x-1">
                <Image src="/companyLogo.png" alt="logo" width={45} height={45} />
                <p className="text-3xl text-white font-semibold">City Traveling</p>
              </NavigationMenuItem>
            </Link>
          </Button>

          {/* start of navigation menu items for different app pages */}
          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-purple-900">Events</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="w-[400px] gap-3 p-4">
                <Link href="/events/create">Create Event</Link>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Button className="bg-inherit shadow-none hover:bg-white text-black">
              <Link href="/friends">Friends</Link>
            </Button>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Button className="bg-inherit shadow-none hover:bg-white text-black">
              <Link href="/about">About</Link>
            </Button>
          </NavigationMenuItem>
          {/* end of navigation menu items for different app pages */}
        </div>

        {/* login button */}
        <NavigationMenuItem>
          <Button className="bg-black rounded-md h-10 w-40 text-xl text-white font-semibold"><Link href="/auth">Login</Link></Button>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}