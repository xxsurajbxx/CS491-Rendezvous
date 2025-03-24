import { FC, useState } from "react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Image from "next/image";
import { RsvpCard } from "../types";
import { Button } from "@/components/ui/button";


export const RsvpCardComponent: FC<RsvpCard> = ({
  eventName,
  host,
  date,
  location,
  startTime,
  endTime,
  //maxRSVP,
  rsvpList
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleInfoBtnEvent = () => {
    
    isOpen === false ? setIsOpen(true) : setIsOpen(false);
  }

  return(
    <Card className="flex flex-row w-3/5 items-center p-2">
      <CardHeader className="flex flex-col w-1/5 items-center border-2 rounded-md bg-[url('/calendarIcon.png')]">
        <p className="text-4xl font-semibold">{date.toLocaleDateString('default', {month: 'short'})}</p>
        <p className="text-3xl font-semibold">{date.getDay()}</p>
      </CardHeader>
      <CardContent className="flex flex-col w-3/5">
        <h2 className="text-2xl font-bold">{eventName}</h2>
        <p>{host}</p>
        <p><span className="font-semibold">Time: </span>{startTime} - {endTime}</p>
        <p><span className="font-semibold">Address: </span>{location}</p>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionContent>
              <p><span className="font-semibold">Rsvp List</span></p>
              {rsvpList && rsvpList.map((person, index) => (
                <div key={index} className="flex flex-row justify-start items-center gap-x-3 my-1">
                  <Image src={person.photo} width={20} height={20} alt="photo" />
                  <p>{person.name}</p>
                </div>
              ))}
            </AccordionContent>
            <AccordionTrigger onClick={handleInfoBtnEvent}>{isOpen === false ? "More Info" : "Less Info"}</AccordionTrigger>
          </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter className="w-1/5 p-3">
        <Button className="w-full bg-purple-900">RSVP</Button>
      </CardFooter>
    </Card>
  );
}