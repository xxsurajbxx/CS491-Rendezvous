import { PersonProfile } from "../types";

import { Card, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import Image from "next/image";
import { Separator } from "@/components/ui/separator";
//import { useCallback } from "react";

interface Friend {
  FriendID: number
  UserID: number;
  Name: string;
  Email: string;
  Since: string;
}


interface CommunityWindowProps {
  userId: number; // UserID passed from parent
  friends: Friend[];
  updateFriends: (requests: Friend[]) => void;
  personProfiles: PersonProfile[];
}


export const CommunityWindow = ({ userId, friends, updateFriends, personProfiles }: CommunityWindowProps) => {

  const getFriends = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/friends/all/${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to fetch friend requests');

      const result = await response.json();
      console.log(friends)

      // Update the count in the parent component
      updateFriends(result.data);
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  const handleUnfollow = async (friendId: number) => {
    try{
      const response = await fetch(`http://localhost:8080/api/friends/delete/${friendId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
       if (!response.ok) throw new Error('Failed to fetch friend requests');
       getFriends();
    }
    catch(error){
      console.error("Error unfollowing friend:", error);
    }
  }

  return(
    <div className="flex flex-col items-center gap-7">
      <p className="text-xl font-semibold">My Friends</p>
      <div className="flex flex-col max-h-[500px] overflow-auto gap-5">
        <div className="flex flex-row justify-center flex-wrap gap-3">
          {friends.map((person, index) => (
            <Card key={index} className="min-w-[220px] w-1/5 min-h-[150px] max-h-[400px] px-2 text-center">
              <CardHeader className="flex items-center h-2/3">
                <Image src='/profileIcon.png' width={90} height={90} alt="profile pic" className="rounded-full bg-[#5C3B58]" />
                <CardTitle className="text-xl">{person.Name}</CardTitle>
              </CardHeader>
              <CardFooter className="flex flex-col items-center h-1/3">
                <CardDescription>You are friends.</CardDescription>
                <Button className="min-h-[30px] bg-inherit shadow-none text-[#5C3B58] font-semibold" onClick={() => handleUnfollow(person.FriendID)}>unfollow</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      
      <Separator className="bg-gray-300" />

      <p className="text-xl font-semibold">People You May Know</p>
      <div className="flex flex-col items-center max-h-[500px] overflow-auto gap-5">
        <div className="flex flex-row justify-center flex-wrap gap-3">
          {personProfiles.map((person, index) => (
            <Card key={index} className="min-w-52 w-1/5 min-h-[150px] max-h-[400px]">
              <CardHeader className="flex items-center h-2/3 text-center">
                <Image src={person.photo} width={90} height={90} alt="profile pic" className="rounded-full bg-[#5C3B58]" />
                <CardTitle className="text-xl">{person.name}</CardTitle>
              </CardHeader>
              <CardFooter className="flex flex-col items-center h-1/3">
                <CardDescription className="h-2/3">Know this person?</CardDescription>
                <Button className="min-h-[30px] list-none bg-[#5C3B58] font-semibold text-white">Add Friend</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}