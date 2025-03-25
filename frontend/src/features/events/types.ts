export interface EventData {
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
    title: string,
    date: string,
    startTime: string,
    endTime: string,
    description: string
    where: string,
    people: string[]
}

export interface SidebarProps {
    events: EventCardData[]
}