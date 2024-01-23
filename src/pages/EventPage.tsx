import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import EventService from '../services/EventService';
import { IEvent } from '../models/iEvent';
import { Context } from "../index";
import UploadEventPicture from "../components/UploadEventPicture";
import {API_URL} from "../http";

const EventPage: React.FC = () => {
    const { eventId } = useParams<{ eventId?: string }>();
    const [eventData, setEventData] = useState<IEvent | undefined>();
    const [seatRow, setSeatRow] = useState<number | undefined>(0);
    const [seatNumber, setSeatNumber] = useState<number | undefined>(0);
    const [isBuyButtonDisabled, setBuyButtonDisabled] = useState(false);
    const { store } = useContext(Context);

    useEffect(() => {
        async function fetchEventData() {
            try {
                if (eventId) {
                    const response = await EventService.getEventById(eventId);
                    setEventData(response.data);
                }
            } catch (error) {
                console.error('Error fetching event data:', error);
            }
        }

        fetchEventData();
    }, [eventId]);

    const handleBuyTicket = async () => {
        try {
            if (eventId && seatRow !== undefined && seatNumber !== undefined) {
                if (!isBuyButtonDisabled) {
                    const response = await EventService.buyTicket(eventId, { seat_row: seatRow, seat_number: seatNumber });
                    const uuid = response.data.result.uuid;
                    setBuyButtonDisabled(true);
                    store.setLoading(true);
                    window.location.href = `https://pay.cryptocloud.plus/${uuid}`;
                }
            }
        } catch (error) {
            console.error('Error buying ticket:', error);
        }
    };

    const handleDeleteImage = async (imageId: string) => {
        try {
            const response = await EventService.deleteImage(imageId);
            // Обновите состояние или выполните другие действия после успешного удаления
            console.log('Image deleted successfully:', response.data);
            window.location.reload();
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    };

    return (
        <div>
            <h1>Event Page</h1>
            {eventData ? (
                <div>
                    <p>Event ID: {eventId}</p>
                    <p>Title: {eventData.title}</p>
                    <p>Event capacity: {eventData.capacity}</p>
                    <p>Ticket price: {eventData.ticket_price}</p>
                    <p>{eventData.date}</p>
                    <div>
                        <label>Seat Row: </label>
                        <input
                            type="number"
                            value={seatRow}
                            onChange={(e) => setSeatRow(parseInt(e.target.value, 10))}
                        />
                    </div>
                    <div>
                        <label>Seat Number: </label>
                        <input
                            type="number"
                            value={seatNumber}
                            onChange={(e) => setSeatNumber(parseInt(e.target.value, 10))}
                        />
                    </div>
                    <button onClick={handleBuyTicket} disabled={isBuyButtonDisabled}>
                        Купить билет
                    </button>
                    <Link to="/">Обратно</Link>
                    <UploadEventPicture eventId={eventId!} />

                    <div>
                        <p>Event Images:</p>
                        {eventData.imagesIds && Array.isArray(eventData.imagesIds) && (
                            eventData.imagesIds.map((imageId: string) => (
                                <div key={imageId}>
                                    <img src={`${API_URL}/image/${imageId}`} alt={`Event Image ${imageId}`}/>
                                    <button onClick={() => handleDeleteImage(imageId)}>Удалить</button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default EventPage;
