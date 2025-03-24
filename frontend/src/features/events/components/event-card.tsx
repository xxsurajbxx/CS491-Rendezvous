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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { EventCardData } from "../types";


export const EventCard: React.FC<EventCardData> = ({title, date, description, where, startTime, endTime, people}) => {
  const [open, setOpen] = useState(false);

  const infoBtnEventHandle = () => {
    if (open === false){
      setOpen(true)
    } else {
      setOpen(false)
    }
  }

  return(
    <Card>
      <CardHeader>
        <CardTitle>
            <p className="text-xl">{date}</p>
            <p className="text-3xl">{title}</p>
        </CardTitle>
        <CardDescription className="py-2">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible>
            <AccordionItem value="item-1" className="overflow-hidden">
              <AccordionContent className="flex flex-col p-0">
                <div className="mb-3">
                  <p className="font-bold">Where:</p>
                  <p>{where}</p>
                </div>
                <div className="mb-3">
                  <p className="font-semibold">Time:</p>
                  <p><span className="font-semibold">From: </span>{startTime} <span className="font-semibold"> To: </span>{endTime}</p>
                </div>
                <div className="mb-3">
                  <p className="font-bold">People You May Know:</p>
                  {people.map((person, index) => (
                    <p key={index}>{person}</p>
                  ))}
                </div>
                <Button className="self-center w-1/2 font-semibold bg-purple-900">RSVP</Button>
              </AccordionContent>
              <AccordionTrigger onClick={infoBtnEventHandle}><h3>{open === false ? "More Info" : "Hide Info"}</h3></AccordionTrigger>
            </AccordionItem>
          </Accordion>
        </CardContent>
    </Card>
  );
}