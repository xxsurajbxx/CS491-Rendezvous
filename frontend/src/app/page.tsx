import { getTokenPayload } from "../../utils/auth"
import { redirect } from "next/navigation"
import HomeClient from "./home-client"

// Server Component for auth check
export default async function Home() {
  const token = getTokenPayload()

  if (!token) {
    redirect("/auth")
  }
  else{
      // Render the client component after auth check
  return <HomeClient />

  }


}

