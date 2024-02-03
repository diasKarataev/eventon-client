export interface ITicket {
    id: string;
    date: string;
    event: string;
    user: string;
    isPayed: true;
    seat_row: string;
    seat_number: string;
    activationLink: string;
    order_id: string;
    isActivated : boolean;
    invoice_id: string;
}