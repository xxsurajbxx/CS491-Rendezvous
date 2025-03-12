import { FC } from "react";
import { PersonProfiles } from "../types";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import Image from "next/image";
import { Separator } from "@/components/ui/separator";

export const CommunityWindow: FC<PersonProfiles> = ({ personProfiles }) => {
  
  return(
    <div className="flex flex-col items-center gap-7">
      <p className="text-xl font-semibold">My Friends</p>
      <div className="flex flex-col items-center max-h-[600px] overflow-auto gap-5">
        <div className="flex flex-row justify-center flex-wrap gap-3">
          {personProfiles.map((person, index) => (
            <Card key={index} className="min-w-52 w-1/5 min-h-[150px] max-h-[400px]">
              <CardHeader className="flex items-center">
                <Image src={person.photo} width={90} height={90} alt="profile pic" className="rounded-full bg-[#5C3B58]" />
                <CardTitle className="text-xl">{person.name}</CardTitle>
              </CardHeader>
              <CardFooter className="flex flex-col items-center">
                <CardDescription>You are friends.</CardDescription>
                <button className="list-none text-[#5C3B58] font-semibold">unfollow</button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      
      <Separator className="bg-gray-300" />

      <p className="text-xl font-semibold">People You May Know</p>
      <div className="flex flex-col items-center max-h-[600px] overflow-auto gap-5">
        <div className="flex flex-row justify-center flex-wrap gap-3">
          {personProfiles.map((person, index) => (
            <Card key={index} className="min-w-52 w-1/5 min-h-[150px] max-h-[400px]">
              <CardHeader className="flex items-center">
                <Image src={person.photo} width={90} height={90} alt="profile pic" className="rounded-full bg-[#5C3B58]" />
                <CardTitle className="text-xl">{person.name}</CardTitle>
              </CardHeader>
              <CardFooter className="flex flex-col items-center">
                <CardDescription>Know this person?</CardDescription>
                <Button className="list-none bg-[#5C3B58] font-semibold text-white">Add Friend</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}