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
import { toast } from "sonner";

export const EventCard: React.FC<EventCardData> = ({EventID, Name, Description, Location, startDateTime, people, attending, isOpen}) => {
  const [open, setOpen] = useState(false);
  const [attendingStatus, setAttendingStatus] = useState<boolean>(attending);

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
      if (!token) throw new Error('Failed to retrieve token from cookies.');

      const response = await fetch(`http://localhost:8080/api/rsvp/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: token?.userId,
          eventId: EventID
        })
      });
      if (!response.ok) throw new Error('Failed to post event rsvp request.');

      const result = await response.json();
      setAttendingStatus(true);
      toast.success("Successfully RSVP'd for event.", );
    } catch (error) {
      console.error('Error rsvping for event.', error);
      toast.error("Failed to RSVP for event.");

    }
  }

  const handleCancelRsvp = async () => {
    try {
      const token = await getTokenPayload();
      if (!token) throw new Error('Failed to retrieve token from cookies.');

      const response = await fetch(`http://localhost:8080/api/rsvp/${token.userId}/${EventID}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to cancel RSVP.');

      const result = await response.json();
      if (response.status === 200) {
        //alert(result.message);
        setAttendingStatus(false);
        toast.success("Successfully UnRSVP'd from event.")
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to UnRSVP from event.");
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
            {attendingStatus === true ? (
              <Button
              onClick={handleCancelRsvp}
                className="self-center w-1/2 font-semibold bg-gray-700"
              >
                Cancel
              </Button>
            ) : (
              <Button
                onClick={handleEventRsvp}
                className="self-center w-1/2 font-semibold bg-purple-900 hover:bg-purple-800"
              >
                RSVP
              </Button>
            )}
          </AccordionContent>
          <AccordionTrigger onClick={infoBtnEventHandle}><h3>{isOpen('event-card-'+EventID) ? "Hide Info" : "More Info"}</h3></AccordionTrigger>
        </AccordionItem>
        </CardContent>
    </Card>
  );
}