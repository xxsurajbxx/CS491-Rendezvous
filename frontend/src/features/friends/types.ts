export type FriendsTabType = 'COMMUNITY' | 'RSVP' | 'REQUESTS';

export interface TabProps {
    setWindow: (newTabType: FriendsTabType) => void;
}

export interface Tab {
    windowType: FriendsTabType,
    title: string,
    url: string,
    iconUrl: string
}

export interface PersonProfile {
    name: string,
    photo: string,
}

export interface PersonProfiles {
    personProfiles: PersonProfile[]
}

export interface RsvpCard {
    eventName: string,
    host: string,
    date: string,
    startTime: string,
    endTime: string,
    maxRSVP: number,
    rsvpList?: PersonProfile[]
}
export interface RsvpCards {
    rsvpCards: RsvpCard[]
}

export interface RsvpWindowProps {
    rsvpCards: RsvpCard[]
}