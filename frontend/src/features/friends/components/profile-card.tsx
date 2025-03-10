import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

import Image from "next/image";

export const ProfileCard = () => {

  return(
    <Card>
      <CardContent>
        <div className="flex flex-row items-center justify-center">
          <Image src="/profileIcon.png" width={40} height={40} alt="profile pic" />
          <p>Gary Heincliff</p>
        </div>
      </CardContent>
    </Card>
  );
}