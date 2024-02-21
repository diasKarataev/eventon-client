export interface IEvent {
    _id: string;
    title: string;
    description: string;
    ticket_price: number;
    capacity: number;
    date: string;
    imagesIds : string;
    city: string;
    map_latitude: number;
    map_longitude: number;
}