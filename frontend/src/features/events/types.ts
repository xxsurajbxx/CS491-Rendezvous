export interface EventData {
    EventID: number
    Name: string,
    startDateTime: Date,
    endDateTime: Date,
    Location: string,
    Description: string,
    isPublic: number,
    HostUserID: number,
    Latitude?: number,
    Longitude?: number,
    people?: string[],
    attending: boolean,
    isHost: boolean,
}

export interface EventCardData {
    EventID: number
    Name: string,
    startDateTime: Date,
    endDateTime: Date,
    HostUserID: number,
    Description: string
    Location: string,
    people?: string[],
    attending: boolean,
    setShowPopup(flag: boolean): void,
    isHost: boolean,
    isOpen(eventCardId: string): boolean
    id: number
}

export interface SidebarProps {
    events: EventCardData[] | undefined,
    openEventCards: string[] | undefined,
    setOpenEventCards(eventCard: string[]): void,
    isOpen(eventCardId: string): boolean,
    handleSearch(query: string): void,
    setShowPopup(flag: boolean): void,
    id: number
}

//Defines a marked position on the leaflet map including name of location, coordinates of location, and a popup description that describes that location/event.
export interface LeafletMarker {
    EventID: number,
    Name: string,
    Description: string,
    Latitude: number,
    Longitude: number
  }