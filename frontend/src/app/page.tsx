import NavigationBar from "../components/navigation-bar";
import { getTokenPayload } from "../../utils/auth";
import { redirect } from "next/navigation";
export default async function Home() {
  const token = getTokenPayload();
  if(!token){
    redirect("/auth");
  }
  return (
    <div>
      <NavigationBar />
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <h1 className="text-2xl font-bold">Hello, Next.js 14!</h1>
      </main>
    </div>
  );
}

