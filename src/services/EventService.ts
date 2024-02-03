    import $api from "../http";
    import {AxiosResponse} from 'axios';
    import {IEvent} from "../models/iEvent";
    import {IBuyTicketResponse} from "../models/IBuyTicketResponse";

    export default class EventService {
        static getEvents() : Promise<AxiosResponse<IEvent[]>>{
            return $api.get<IEvent[]>('/events');
        }
        static getEventById(eventId: string): Promise<AxiosResponse<IEvent>> {
            return $api.get<IEvent>(`/events/${eventId}`);
        }
        static buyTicket(eventId: string, buyTicketData: {
            seat_row: number;
            seat_number: number
        }): Promise<AxiosResponse<IBuyTicketResponse>> {
            return $api.post<IBuyTicketResponse>(`/tickets/buy-ticket/${eventId}`, buyTicketData);
        }
        static uploadImage(eventId: string, file: File): Promise<AxiosResponse> {
            const formData = new FormData();
            formData.append('image', file);
            return $api.post(`/image/event/${eventId}`, formData);
        }
        static deleteImage(imageId: string): Promise<AxiosResponse> {
            return $api.delete(`/image/${imageId}`);
        }
        static deleteEvent(eventId: string): Promise<AxiosResponse> {
            return $api.delete(`/events/${eventId}`);
        }
        static createEvent(eventData: {
            title: string,
            description: string,
            capacity: number,
            ticket_price: number
        }): Promise<AxiosResponse> {
            return $api.post(`/events`, eventData);
        }

        static updateEvent(eventId: string, eventData: {
            title: string,
            description: string,
            capacity: number,
            ticket_price: number
        }): Promise<AxiosResponse> {
            return $api.patch(`/events/${eventId}`, eventData);
        }
    }