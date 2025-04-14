import {
  Card,
  CardContent,
} from "@/components/ui/card";
import Image from "next/image";

interface ProfileCardProps {
  name: string,
}

export const ProfileCard = ({ name }: ProfileCardProps) => {

  return(
    <Card>
      <CardContent className="flex flex-row items-center justify-center p-3 gap-x-3">
        <Image src="/profileIcon.png" width={40} height={40} alt="profile pic" />
        <p>{name}</p>
      </CardContent>
    </Card>
  );
}