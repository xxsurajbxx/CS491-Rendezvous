import { FC, useState } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import Image from "next/image";

import { RsvpCard } from "../types";

export const RsvpCardComponent: FC<RsvpCard> = ({
  eventName,
  host,
  date,
  startTime,
  endTime,
  maxRSVP,
  rsvpList
}) => {
  const [isOpen, setisOpen] = useState<boolean>(false);

  const handleInfoBtnEvent = () => {
    isOpen === false ? setisOpen(true) : setisOpen(false);
  }

  return(
    <Card className="w-3/5">
      <CardHeader>
        <CardTitle>{eventName}</CardTitle>
        <CardDescription>Host: {host}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{startTime} - {endTime}</p>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionContent>
              <p>Rsvp List</p>
              {rsvpList && rsvpList.map((person, index) => (
                <div key={index} className="flex flex-row justify-start items-center gap-x-3 my-1">
                  <Image src={person.photo} width={20} height={20} alt="photo" />
                  <p>{person.name}</p>
                </div>
              ))}
            </AccordionContent>
            <AccordionTrigger onClick={handleInfoBtnEvent}>{isOpen === false ? "Who's going?" : "Less Info"}</AccordionTrigger>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}