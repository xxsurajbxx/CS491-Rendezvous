import NavigationBar from "@/components/navigation-bar";
import { getTokenPayload } from "../../../../utils/auth";
import { EventScreen } from "@/components/event-screen";
import { redirect } from "next/navigation";
export default async function EventPage() {
    const token = await getTokenPayload();
    if (!token) {
        redirect("/auth");
    }
    else{
        return (
            <div>
                <NavigationBar />
                <EventScreen />
            </div>
        )
    }
};