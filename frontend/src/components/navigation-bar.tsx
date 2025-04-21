"use client";
import { Button } from "@/components/ui/button";
import { removeTokenCookieWithRedirect, getTokenPayload, DecodedToken } from "../../utils/auth";
import {
 NavigationMenu,
 //NavigationMenuContent,
 NavigationMenuItem,
 NavigationMenuList,
 //NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";


import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function NavigationBar() {
 const [token, setToken] = useState<DecodedToken | null>(null);
 const router = useRouter();


 // Fetch token on component mount
 useEffect(() => {
   async function fetchToken() {
     const payload = await getTokenPayload();
     if (!payload || payload === null) {
       router.push("/auth");
     } else {
       setToken(payload);
     }
   }
   fetchToken();
 }, [router]);


 async function handleLogout() {
   await removeTokenCookieWithRedirect();
   router.push("/auth");
 }


 return (
   <NavigationMenu className="bg-purple-900 h-20">
     <NavigationMenuList className="flex justify-between w-screen px-7">
       <div className="flex flex-row items-center">
         {/* Company logo and Company Name */}
         <Button className="bg-inherit hover:bg-inherit shadow-none">
           <Link href="/">
             <NavigationMenuItem className="flex flex-row items-center">
               <Image src="/companyLogo.png" alt="logo" width={80} height={80} />
               <p className="text-3xl text-white font-semibold">Rendezvous</p>
             </NavigationMenuItem>
           </Link>
         </Button>


         {/* start of navigation menu items for different app pages */}
         <NavigationMenuItem>
           <Button className="bg-inherit shadow-none hover:bg-white text-black">
             <Link href="/events/create">Create Event</Link>
           </Button>
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
       <div className="flex flex-row">
         {/* login/logout button */}
         <NavigationMenuItem>
           {token ? (
             <Button
               className="bg-black rounded-md h-10 w-40 text-xl text-white font-semibold"
               onClick={handleLogout}
             >
               Logout
             </Button>
           ) : (
             <Button className="bg-black rounded-md h-10 w-40 text-xl text-white font-semibold">
               <Link href="/auth">Login</Link>
             </Button>
           )}
         </NavigationMenuItem>


         {/* profile icon */}
         <Button className="bg-inherit shadow-none hover:bg-inherit">
           <Link href={token?.userId ? `/users/${token.userId}` : "/profile"}>
             <Image
               src="/profileIcon.png"
               height={45}
               width={45}
               alt="profile icon"
               className="bg-gray-600 rounded-full"
             />
           </Link>
         </Button>
       </div>
     </NavigationMenuList>
   </NavigationMenu>
 );
}



