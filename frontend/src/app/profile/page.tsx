import { ProfileScreen } from "@/features/profile/components/profile-screen";
import { getTokenPayload } from "../../../utils/auth";
import { redirect } from "next/navigation";

export default async function ProfilePage(){
  const token = await getTokenPayload();
  if (!token) {
    redirect("/auth");
}
else{
  return(
    <ProfileScreen />
  );
}
}