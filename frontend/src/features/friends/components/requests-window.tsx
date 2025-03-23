import { FC } from "react";
import { PersonProfiles } from "../types";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import Image from "next/image";

export const RequestsWindow: FC<PersonProfiles> = ({ personProfiles }) => {

  return(
    <div className="flex flex-col items-center gap-7">
      <p className="text-xl font-semibold">Grow Your Community</p>
      <div className="flex flex-col gap-5">
        <div className="flex flex-row justify-center flex-wrap gap-3">
          {personProfiles.map((person, index) => (
            <Card key={index} className="min-w-[220px] w-1/5 min-h-[150px] max-h-[400px] px-2 text-center">
              <CardHeader className="flex h-2/3 items-center">
                <Image src={person.photo} width={90} height={90} alt="profile pic" className="rounded-full bg-[#5C3B58]" />
                <CardTitle className="text-xl">{person.name}</CardTitle>
              </CardHeader>
              <CardFooter className="flex flex-col h-1/3 items-center px-0">
                <CardDescription className="h-2/3">{person.name} wants to be friends</CardDescription>
                <Button className="min-h-[30px] list-none bg-purple-900 font-semibold text-white">Accept</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}