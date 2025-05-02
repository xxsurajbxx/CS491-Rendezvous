import { VerifyScreen } from "@/features/verify/verify-screen";
import { getTokenPayload } from "../../../utils/auth";
import { redirect } from "next/navigation";


export default async function VerifyPage(){
  const token = await getTokenPayload();
  if (!token) {
      redirect("/auth");
  }
  else{
    return(
      <VerifyScreen userId={token.userId} email={token.email} />
    );
  }
}