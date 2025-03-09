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

export const EventCard: React.FC<EventCard> = ({title, date, description, where, people}) => {
  const [open, setOpen] = useState(false);

  const infoBtnEventHandle = () => {
    open === false ? setOpen(true) : setOpen(false);
  }

  return(
    <Card>
      <CardHeader className="">
        <CardTitle className="flex flex-row items-center justify-center">
          <div className="w-fit"><p className="text-xl">{date}</p></div>
          <div className="w-fit h-full"><p className="text-2xl">{title}</p></div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible>
            <AccordionItem value="item-1" className="overflow-hidden">
              <AccordionContent>
                <p>Description: {description}</p>
                <p>{where}</p>
                <p>People You May Know:</p>
                {people.map(person => (
                  <p>{person}</p>
                ))}
              </AccordionContent>
              <AccordionTrigger onClick={infoBtnEventHandle}><h3>{open === false ? "More Info" : "Hide Info"}</h3></AccordionTrigger>
            </AccordionItem>
          </Accordion>
        </CardContent>
    </Card>
  );
}