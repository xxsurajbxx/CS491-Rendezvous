import { FC } from "react";
import { PersonProfiles } from "../types";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import Image from "next/image";

export const CommunityWindow: FC<PersonProfiles> = ({ personProfiles }) => {
  
  return(
    <div>
      <div>
        <p>My Friends</p>
        <div className="flex flex-row flex-wrap gap-3">
          {personProfiles.map((person, index) => (
            <Card key={index} className="w-1/4 min-h-[150px] max-h-[400px]">
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
      
      <div>
        <p>People You May Know</p>
        <div className="flex flex-row flex-wrap gap-3">
          {personProfiles.map((person, index) => (
            <Card key={index} className="w-1/4 min-h-[150px] max-h-[400px]">
              <CardHeader className="flex items-center">
                <Image src={person.photo} width={90} height={90} alt="profile pic" className="rounded-full bg-[#5C3B58]" />
                <CardTitle className="text-xl">{person.name}</CardTitle>
              </CardHeader>
              <CardFooter className="flex flex-col items-center">
                <CardDescription>Know this person?</CardDescription>
                <Button className="rounded-full bg-purple-900 font-semibold text-white">Add friend</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}