import { FriendsScreen } from "@/features/friends/components/friends-screen";
import { getTokenPayload } from "../../../utils/auth";
import { redirect } from "next/navigation";
export default async function FriendsPage() {
      const token = await getTokenPayload();
      if (!token) {
          redirect("/auth");
      }
      else{
        return(
          <FriendsScreen userId={token.userId} name={token.name}/>
        );
      }
}
