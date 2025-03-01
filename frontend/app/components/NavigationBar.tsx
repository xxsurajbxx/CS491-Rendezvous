/**
 * Main component for the Navigation Bar used on majority of the pages for City Traveling app.
 */

//shadcn imports
import { Button } from "@/components/ui/button";

//Nextjs imports
import Image from "next/image";
import Link from "next/link";

//image imports
import companyLogo from "../../public/companyLogo.png"


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
      <nav className="bg-purple-900">
        <div className="flex w-full items-center h-20 px-7">
          <div className="flex items-center justify-between">
            <Image src={companyLogo} alt="logo" width={50} />
            <p className="text-3xl text-white font-semibold">City Traveling</p>
          </div>
          <Button className="ml-auto bg-black rounded-md h-10 w-40 text-xl text-white font-semibold"><Link href="/LoginPage">Sign Up</Link></Button>
        </div>
        
      </nav>
  );
}