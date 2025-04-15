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

export type RsvpStatus = {
    status: 'Attending' | 'Cancelled'
}

export interface RsvpData {
    EventID: number,
    EventName: string,
    EventDate: Date,
    Status: string,
    RSVPTimestamp: Date,
    rsvpList?: PersonProfile[],
    // handleRsvpCancel(): void,
}
export interface RsvpCards {
    rsvpCards: RsvpData[]
}

export interface RsvpWindowProps {
    rsvpsData: RsvpData[]
}