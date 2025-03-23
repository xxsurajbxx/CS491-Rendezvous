import { FC, useState } from "react";
import { RsvpCardComponent } from "./rsvp-card";

import { RsvpCards, RsvpWindowProps } from "../types";

export const RsvpWindow: FC<RsvpWindowProps> = ({ rsvpCards }) => {

  return(
    <div className="flex flex-col gap-y-3 items-center">
      <h2 className="text-xl font-semibold">RSVP&apos;s</h2>
      <div className="flex flex-col w-full gap-5 items-center">
        {rsvpCards.map((cardData,index) => (
          <RsvpCardComponent key={index} {...cardData}  />
        ))}
      </div>
    </div>
  );
}