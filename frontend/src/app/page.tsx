import NavigationBar from "@/components/navigation-bar";
import dynamic from "next/dynamic";

export default function Home() {
  //dynamically loaded leaflet map
  const LeafletMap = dynamic(
    () => import('../components/leaflet-map'), {
      ssr: false
    }
  );

  return (
    <div>
      <NavigationBar />
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <h1 className="text-2xl font-bold">Hello, Next.js 14!</h1>
        <LeafletMap />
      </main>
    </div>
  );
}

