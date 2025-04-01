import { AboutScreen } from "@/features/about/AboutScreen";
import { getTokenPayload } from "../../../utils/auth";
import { redirect } from "next/navigation";

export default async function AboutPage(){
  const token = await getTokenPayload();
  if (!token) {
      redirect("/auth");
  }
  else{
    return(
      <AboutScreen />
    );
  }
}