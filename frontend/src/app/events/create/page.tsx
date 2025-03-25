import { EventForm } from "@/components/event-form";
import NavigationBar from "@/components/navigation-bar";
import { getTokenPayload } from "../../../../utils/auth";
import { redirect } from "next/navigation";
export default async function EventCreationPage() {
    const token = await getTokenPayload();
    if (!token) {
        redirect("/auth");
    }
    else{
        return (
            <div>
                <NavigationBar />
                <EventForm/>
            </div>
        )
    }
};