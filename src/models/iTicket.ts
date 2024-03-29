export interface ITicket {
    id: string;
    date: string;
    event: string;
    user: string;
    isPaid: false;
    seat_row: string;
    seat_number: string;
    activationLink: string;
    isActivated : boolean;
}