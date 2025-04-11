import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import dayjs from "dayjs";
import { getTokenPayload } from "../../../../utils/auth";
import { EventCardData } from "../types";
import { error } from "console";


export const EventCard: React.FC<EventCardData> = ({EventID, Name, Description, Location, startDateTime, people, isOpen}) => {
  const [open, setOpen] = useState(false);

  const infoBtnEventHandle = () => {
    if (open === false){
      setOpen(true)
    } else {
      setOpen(false)
    }
  }

  const formatDate = (dateString: Date) => {
    return dayjs(dateString).format('MMMM D');
  };

  const formatTime = (dateTime: Date) => {
    return dayjs(dateTime).format('h:mm A');
  }

  const handleEventRsvp = async () => {
    try {
      const token = await getTokenPayload();
      const response = await fetch(`http://localhost:8080/api/rsvp/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: token?.userId,
          eventId: EventID
        })
      });
      if (!token) throw new Error('Failed to retrieve token from cookies.')
      // if (!response.ok) throw new Error('Failed to post event rsvp request.');

      const result = await response.json();
      if (response.status === 409) {
        alert(result.message)
      } else if (response.status === 201) {
        alert(result.message)
      }
    } catch (error) {
      console.error('Error rsvping for event.', error);
    }
  }

  return(
    <Card id={'event-card-'+EventID}>
      <CardHeader>
        <CardTitle>
            <p className="text-xl">{formatDate(startDateTime)}</p>
            <p className="text-3xl">{Name}</p>
        </CardTitle>
        <CardDescription className="py-2">{Description}</CardDescription>
      </CardHeader>
      <CardContent>
        <AccordionItem value={'event-card-'+EventID}>
          <AccordionContent className="flex flex-col p-0">
            <div className="mb-3">
              <p> <span className="font-bold">Where: </span>{Location}</p>
            </div>
            <div className="mb-3">
              <p><span className="font-semibold">Time: </span>{formatTime(startDateTime)}</p>
            </div>
            { people && people.length > 0 && (
              <div className="mb-3">
                <p className="font-bold">People You May Know:</p>
                {people && people.map((person, index) => (
                  <p key={index}>{person}</p>
                ))}
              </div>
            )}
            
            <Button onClick={handleEventRsvp} className="self-center w-1/2 font-semibold bg-purple-900">RSVP</Button>
          </AccordionContent>
          <AccordionTrigger onClick={infoBtnEventHandle}><h3>{isOpen('event-card-'+EventID) ? "Hide Info" : "More Info"}</h3></AccordionTrigger>
        </AccordionItem>
        </CardContent>
    </Card>
  );
}