import { useState } from "react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RsvpData } from "../types";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import { Trash2 } from "lucide-react";
import { getTokenPayload } from "../../../../utils/auth";


export const RsvpCardComponent = ({
  EventID,
  EventName,
  EventDate,
  Status,
  RSVPTimestamp,
}: RsvpData) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleInfoBtnEvent = () => {
    if (isOpen === false) {
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
  }

  const formatMonth = (date: Date) => {
    return dayjs(date).format("MMM");
  }
  const formatDay = (date: Date) => {
    return dayjs(date).format('D');
  }
  const formatTime = (date: Date) => {
    return dayjs(date).format('h:mm A');
  }

  const handleEventCancel = async () => {
    try {
      const token = await getTokenPayload();
      if (!token) throw new Error("Error occurred while fetching token.")

      const response = await fetch('http://localhost:8080/api/rsvp/', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: token.userId,
          eventId: EventID
        })
      });
      if (!response.ok) throw new Error('Bad Request. Try Again.')

      const result = await response.json();
      console.log(result)
    } catch (error) {
      console.error('Error occurred while cancelling a RSVP', error)
    }
  }

  return(
    <Card className="flex flex-row w-3/5 items-center p-2">
      <CardHeader className="flex flex-col w-1/5 items-center border-2 rounded-md bg-[url('/calendarIcon.png')]">
        <p className="text-4xl font-semibold">{formatMonth(EventDate)}</p>
        <p className="text-3xl font-semibold">{formatDay(EventDate)}</p>
      </CardHeader>
      <CardContent className="flex flex-col w-3/5">
        <h2 className="text-2xl font-bold">{EventName}</h2>
        <p><span className="font-semibold">Time: </span>{formatTime(EventDate)}</p>
        <p><span className="font-semibold">Status: </span>{String(Status)}</p>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionContent>
              <p>{`RSVP'ed on ${dayjs(RSVPTimestamp).format('MMMM D')}`}</p>
            </AccordionContent>
            <AccordionTrigger onClick={handleInfoBtnEvent}>{isOpen === false ? "More Info" : "Less Info"}</AccordionTrigger>
          </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter className="w-1/5 p-3">
        {Status === 'Attending' && <Button className="w-full bg-purple-900" onClick={handleEventCancel}><Trash2 className="h-6 w-6" /></Button>}
      </CardFooter>
    </Card>
  );
}