import { DiscoverScreen } from "@/features/friends/components/discover-screen";
import { getTokenPayload } from "../../../utils/auth";
import { redirect } from "next/navigation";
import NavigationBar from "@/components/navigation-bar";
export default async function DiscoverPage() {
      const token = await getTokenPayload();
      if (!token) {
          redirect("/auth");
      }
      else{
        return(
          <div>
            <NavigationBar />
            <DiscoverScreen id={token.userId} />
          </div>

        );
      }
}
