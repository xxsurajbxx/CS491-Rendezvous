export interface EventData {
    EventID: number
    Name: string,
    startDateTime: Date,
    endDateTime?: Date,
    Description: string
    Location: string,
    Latitude?: number,
    Longitude?: number,
    people?: string[]
}

export interface EventCardData {
    EventID: number
    Name: string,
    startDateTime: Date,
    endDateTime?: Date,
    Description: string
    Location: string,
    people?: string[],
    isOpen(eventCardId: string): boolean
}

export interface SidebarProps {
    events: EventCardData[] | undefined,
    openEventCards: string[] | undefined,
    setOpenEventCards(eventCard: string[]): void,
    isOpen(eventCardId: string): boolean
}

//Defines a marked position on the leaflet map including name of location, coordinates of location, and a popup description that describes that location/event.
export interface LeafletMarker {
    EventID: number,
    Name: string,
    Description: string,
    Latitude: number,
    Longitude: number
  }