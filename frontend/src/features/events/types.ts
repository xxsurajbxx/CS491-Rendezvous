export interface EventData {
    EventID: number
    Name: string,
    startDateTime: Date,
    endTime?: Date,
    Description: string
    location: string,
    Latitude?: number,
    Longitude?: number,
    people?: string[]
}

export interface EventCardData {
    EventID: number
    Name: string,
    startDateTime: Date,
    endTime?: Date,
    Description: string
    location: string,
    people?: string[]
}

export interface SidebarProps {
    events: EventCardData[] | undefined,
    openEventCards: string[] | undefined,
    setOpenEventCards(eventCard: string[]): void,
}