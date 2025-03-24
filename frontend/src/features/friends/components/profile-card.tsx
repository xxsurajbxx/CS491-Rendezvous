import {
  Card,
  CardContent,
} from "@/components/ui/card";

import Image from "next/image";

export const ProfileCard = () => {

  return(
    <Card>
      <CardContent className="flex flex-row items-center justify-center p-3 gap-x-3">
        <Image src="/profileIcon.png" width={40} height={40} alt="profile pic" />
        <p>Gary Heincliff</p>
      </CardContent>
    </Card>
  );
}