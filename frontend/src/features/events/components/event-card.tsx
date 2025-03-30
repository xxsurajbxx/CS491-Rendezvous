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
import { EventCardData } from "../types";


export const EventCard: React.FC<EventCardData> = ({EventID, Name, Description, location, startDateTime, endTime, people}) => {
  const [open, setOpen] = useState(false);

  const infoBtnEventHandle = () => {
    if (open === false){
      setOpen(true)
    } else {
      setOpen(false)
    }
  }

  return(
    <Card id={'event-card-'+EventID}>
      <CardHeader>
        <CardTitle>
            <p className="text-xl">{startDateTime.toLocaleString()}</p>
            <p className="text-3xl">{Name}</p>
        </CardTitle>
        <CardDescription className="py-2">{Description}</CardDescription>
      </CardHeader>
      <CardContent>
        <AccordionItem value={'event-card-'+EventID}>
          <AccordionContent className="flex flex-col p-0">
            <div className="mb-3">
              <p className="font-bold">Where:</p>
              <p>{location}</p>
            </div>
            <div className="mb-3">
              <p><span className="font-semibold">Time: </span>{startDateTime.toString()}</p>
            </div>
            <div className="mb-3">
              <p className="font-bold">People You May Know:</p>
              {people && people.map((person, index) => (
                <p key={index}>{person}</p>
              ))}
            </div>
            <Button className="self-center w-1/2 font-semibold bg-purple-900">RSVP</Button>
          </AccordionContent>
          <AccordionTrigger onClick={infoBtnEventHandle}><h3>{open === false ? "More Info" : "Hide Info"}</h3></AccordionTrigger>
        </AccordionItem>
        </CardContent>
    </Card>
  );
}