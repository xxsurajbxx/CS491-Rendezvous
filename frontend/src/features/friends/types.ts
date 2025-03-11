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