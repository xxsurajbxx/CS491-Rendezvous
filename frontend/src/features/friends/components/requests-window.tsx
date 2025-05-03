//import { useCallback } from "react";
//import { PersonProfiles } from "../types";

import { Card, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import Image from "next/image";
import { getTokenPayload } from "../../../../utils/auth";

interface RequestsWindowProps {
  userId: number; // UserID passed from parent
  friendRequests: FriendRequest[];
  updateFriendRequests: (requests: FriendRequest[]) => void;
  updateFriends: (requests: Friend[]) => void;
}

interface FriendRequest {
  FriendID: number; // This is an integer in the database, you can keep it as a number
  UserID: number;   // Similarly, UserID will be an integer
  Name: string;     // Name is a string
  Email: string;    // Email is a string
}
interface Friend {
  FriendID: number;
  UserID: number;
  Name: string;
  Email: string;
  Since: string;
}

export const RequestsWindow= ({ userId, friendRequests, updateFriendRequests, updateFriends }: RequestsWindowProps) => {

  const getFriends = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/friends/all/${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to fetch friend requests');

      const result = await response.json();

      // Update the count in the parent component
      updateFriends(result.data);
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };


  // Function to get the friend requests
  const getFriendRequests = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/friends/requests/${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to fetch friend requests');

      const result = await response.json();
      console.log(friendRequests)

      // Update the count in the parent component
      updateFriendRequests(result.data);
    } catch (error) {
      console.error('Error fetching friend requests:', error);
    }
  };

  // Handle accepting or denying a friend request
  const handleRequest = async (action: "accept" | "reject", friendId: number) => {
    console.log(friendId);
    try {
      const token = await getTokenPayload();
      if (!token) throw new Error("Error occurred while getting jwt token");
      if (!token.verified) throw new Error("User cannot add friend because user is not verified")

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/friends/respond/${friendId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) throw new Error('Failed to process the request');

      // Refresh the friend requests after accepting/denying
      getFriendRequests();
      getFriends();
    } catch (error) {
      console.error('Error processing friend request:', error);
    }
  };

  return(
    <div className="flex flex-col items-center gap-7">
      <p className="text-xl font-semibold">Grow Your Community</p>
      <div className="flex flex-col gap-5">
        <div className="flex flex-row justify-center flex-wrap gap-3">
          {friendRequests.map((request, index) => (
            <Card key={index} className="min-w-[220px] w-1/5 min-h-[150px] max-h-[400px] px-2 text-center">
              <CardHeader className="flex h-2/3 items-center">
                <Image src='/profileIcon.png' width={90} height={90} alt="profile pic" className="rounded-full bg-[#5C3B58]" />
                <CardTitle className="text-xl">{request.Name}</CardTitle>
              </CardHeader>
              <CardFooter className="flex flex-col h-1/3 items-center px-0">
                <CardDescription className="h-2/3">{request.Email} wants to be friends</CardDescription>
                <Button className="min-h-[30px] list-none bg-purple-900 font-semibold text-white" onClick={() => handleRequest("accept", request.FriendID)}>
                  Accept
                </Button>
                <Button className="min-h-[30px] list-none bg-gray-500 font-semibold text-white mt-2" onClick={() => handleRequest("reject", request.FriendID)}>
                  Deny
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}