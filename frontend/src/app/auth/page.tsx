import { AuthScreen } from "@/features/auth/components/auth-screen";
import { getTokenPayload } from "../../../utils/auth";
import { redirect } from "next/navigation";
export default async function AuthPage() {
    const token = await getTokenPayload();
    if(token){
        redirect("/");
    }
    else{
        return (<AuthScreen/>);
    }

};
