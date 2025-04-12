import { Card } from "@/components/ui/card";

interface ProfileCardProps {
  name: string,
  address?: string,
  about: string
}

export const ProfileCard = ({ name, address, about }: ProfileCardProps) => {

  return (
    <Card className="flex flex-col">

      <p>{name}</p>
      {address !== null ? <p>{address}</p> : null}
      {about !== null ? <p>{about}</p> : null}
    </Card>
  );
}