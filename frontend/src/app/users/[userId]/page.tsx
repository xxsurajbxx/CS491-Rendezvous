import NavigationBar from "@/components/navigation-bar";
import { getTokenPayload } from "../../../../utils/auth";
import UserScreen from "@/components/user-screen";
import { redirect } from "next/navigation";



export default async function UserPage() {
  const token = await getTokenPayload();
  if (!token) {
    redirect("/auth");
  } else { 
        return (
        <div>
            <NavigationBar/>
            <UserScreen id={token.userId}/>
        </div>
        );
  }
}
