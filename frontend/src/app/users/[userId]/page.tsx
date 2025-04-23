import NavigationBar from "@/components/navigation-bar"
import { getTokenPayload } from "../../../../utils/auth"
import UserScreen from "@/components/user-screen"
import { redirect } from "next/navigation"

export default async function UserPage({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const token = await getTokenPayload()
  if (!token) {
    redirect("/auth")
  }

  // Await the params Promise to get the userId
  const { userId } = await params

  // Check if the user is viewing their own profile
  const isOwnProfile = userId === token.userId.toString()

  return (
    <div>
      <NavigationBar hideNotification={isOwnProfile} />
      <UserScreen id={token.userId} />
    </div>
  )
}
