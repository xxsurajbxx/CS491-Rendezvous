export interface EventData {
    id: number
    title: string,
    date: string,
    startTime: string,
    endTime: string,
    description: string
    where: string,
    locationLat: number,
    locationLong: number,
    people: string[]
}

export interface EventCardData {
    id: number,
    title: string,
    date: string,
    startTime: string,
    endTime: string,
    description: string
    where: string,
    people: string[]
}

export interface SidebarProps {
    events: EventCardData[],
    openEventCard: string | undefined,
    setOpenEventCard(eventCard: string | undefined): void,
}