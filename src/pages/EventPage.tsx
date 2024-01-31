import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Container, Row, Col, Button, Form, Card, Image } from 'react-bootstrap';
import EventService from '../services/EventService';
import { IEvent } from '../models/iEvent';
import { Context } from "../index";
import UploadEventPicture from "../components/UploadEventPicture";
import { API_URL } from "../http";
import 'bootstrap/dist/css/bootstrap.min.css';
import {observer} from "mobx-react-lite";

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
        <Container className="mt-4">
            {eventData ? (
                <Row>
                    <Row>
                        <Card>
                            <Card.Body>
                                <Card.Title>{eventData.title}</Card.Title>
                                <Card.Text>
                                    <p>Event ID: {eventId}</p>
                                    <p>Event capacity: {eventData.capacity}</p>
                                    <p>Ticket price: {eventData.ticket_price}</p>
                                    <p>{eventData.date}</p>
                                    <Form>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Seat Row:</Form.Label>
                                            <Form.Control type="number" value={seatRow} onChange={(e) => setSeatRow(parseInt(e.target.value, 10))} />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Seat Number:</Form.Label>
                                            <Form.Control type="number" value={seatNumber} onChange={(e) => setSeatNumber(parseInt(e.target.value, 10))} />
                                        </Form.Group>
                                        <Button variant="success" onClick={handleBuyTicket} disabled={isBuyButtonDisabled}>
                                            Купить билет
                                        </Button>
                                    </Form>
                                    <Link to="/" className="btn btn-secondary mt-3">
                                        Обратно
                                    </Link>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Row>

                    <Col md={12} className="mt-4">
                        <h4>Event Images:</h4>
                        <Row>
                            {eventData.imagesIds && Array.isArray(eventData.imagesIds) ? (
                                eventData.imagesIds.map((imageId: string) => (
                                    <Col md={2} key={imageId}>
                                        <Card className="mb-3">
                                            <Image src={`${API_URL}/image/${imageId}`} alt={`Event Image ${imageId}`} fluid style={{objectFit: 'cover', height: '100px'}}/>
                                            <Card.Body>
                                                <Button variant="danger" onClick={() => handleDeleteImage(imageId)}>
                                                    Удалить
                                                </Button>
                                                <Link to={`${API_URL}/image/${imageId}`} className="btn btn-success mt-3">
                                                    Посмотреть
                                                </Link>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))
                            ) : (
                                <Col md={12}>This event has no pictures</Col>
                            )}
                        </Row>
                    </Col>
                    <Row>
                        <UploadEventPicture eventId={eventId!} />
                    </Row>
                </Row>
            ) : (
                <p>Loading...</p>
            )}
        </Container>
    );
};

export default observer(EventPage);
