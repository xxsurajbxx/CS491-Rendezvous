import NavigationBar from "@/components/navigation-bar";
import { getTokenPayload } from "../../../utils/auth";
import { redirect } from "next/navigation";
export default async function UserSearchPage() {
    const token = await getTokenPayload();
    if (!token) {
        redirect("/auth");
    }
    else{
        return (
            <div>
                <NavigationBar />
            </div>
        )
    }
};