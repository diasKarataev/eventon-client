import React, {FC, useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { IEvent } from '../../models/iEvent';
import EventService from '../../services/EventService';
import Modal from 'react-modal'
import {Button, Card, Col, Image, Row} from "react-bootstrap";
import {API_URL} from "../../http";
import UploadEventPicture from "../UploadEventPicture";
import './Events.css';



const Events: FC = () => {
    const [events, setEvents] = useState<IEvent[]>([]);
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: '',
        description: '',
        capacity: 50,
        ticket_price: 1000,
    });
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
    const [editEvent, setEditEvent] = useState<IEvent | null>(null);


    const handleDeleteImage = async (imageId: string) => {
        try {
            const response = await EventService.deleteImage(imageId);
            console.log('Image deleted successfully:', response.data);
            window.location.reload();
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    };

    const openEditModal = async (eventId: string) => {
        try {
            setSelectedEventId(eventId);
            const response = await EventService.getEventById(eventId);
            setEditEvent(response.data);

            setNewEvent({
                title: response.data.title,
                description: response.data.description,
                capacity: response.data.capacity,
                ticket_price: response.data.ticket_price,
            });

            setEditModalOpen(true);
        } catch (error) {
            console.error('Error fetching event data for editing:', error);
        }
    };

    const closeEditModal = () => {
        setSelectedEventId(null);
        setEditEvent(null);
        setEditModalOpen(false);
    };

    const handleEditEvent = async () => {
        try {
            if (selectedEventId && editEvent) {
                await EventService.updateEvent(selectedEventId, newEvent);
                closeEditModal();
                fetchEvents();
            }
        } catch (e) {
            console.log(e);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewEvent((prevEvent) => ({
            ...prevEvent,
            [name]: value,
        }));
    };

    const handleCreateEvent = async () => {
        try {
            await EventService.createEvent(newEvent);
            closeCreateModal();
            fetchEvents();
        } catch (e) {
            console.log(e);
        }
    };


    const openCreateModal = () => {
        setCreateModalOpen(true);
    };

    const closeCreateModal = () => {
        setCreateModalOpen(false);
    };

    const fetchEvents = async () => {
        try {
            const response = await EventService.getEvents();
            setEvents(response.data);
        } catch (e) {
            console.log(e);
        }
    };

    const handleDelete = async (eventId: string) => {
        try {
            await EventService.deleteEvent(eventId);
            fetchEvents();
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        fetchEvents();
        const fetchEditEventData = async () => {
            try {
                if (selectedEventId) {
                    const response = await EventService.getEventById(selectedEventId);
                    setEditEvent(response.data);
                }
            } catch (error) {
                console.error('Error fetching edit event data:', error);
            }
        };

        fetchEditEventData();
    }, [selectedEventId]);


    return (
        <div>
            {isEditModalOpen && (
                <div className="white-overlay"></div>
            )}
            {isCreateModalOpen && (
                <div className="white-overlay"></div>
            )}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>Events</h1>
                <button className="btn btn-success" onClick={openCreateModal}>
                    Create Event
                </button>
            </div>
            <table className="table">
                <thead>
                <tr>
                    <th>Title</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {events.map((event) => (
                    <tr key={event._id}>
                        <td>{event.title}</td>
                        <td>
                            <button
                                className="btn btn-primary"
                                onClick={() => openEditModal(event._id)}
                            >
                                Edit
                            </button>
                            <button
                                className="btn btn-danger ms-2"
                                onClick={() => handleDelete(event._id)}
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <Modal
                isOpen={isCreateModalOpen}
                onRequestClose={closeCreateModal}
                contentLabel="Create Event Modal"
                shouldCloseOnOverlayClick={false}  // Prevent closing on overlay click
                shouldCloseOnEsc={false}  // Prevent closing on Escape key
                className={{
                    base: 'custom-modal',
                    afterOpen: 'custom-modal-content',
                    beforeClose: 'custom-modal-content',
                }}
                overlayClassName={{
                    base: 'custom-modal-overlay',
                    afterOpen: 'custom-modal-overlay',
                    beforeClose: 'custom-modal-overlay',
                }}
            >
                <div>
                    <h2>Create Event</h2>
                    <form>
                        <div className="mb-3">
                            <label htmlFor="title" className="form-label">
                                Title
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="title"
                                name="title"
                                value={newEvent.title}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="description" className="form-label">
                                Description
                            </label>
                            <textarea
                                className="form-control"
                                id="description"
                                name="description"
                                value={newEvent.description}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="capacity" className="form-label">
                                Capacity
                            </label>
                            <input
                                type="number"
                                className="form-control"
                                id="capacity"
                                name="capacity"
                                value={newEvent.capacity}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="ticket_price" className="form-label">
                                Ticket Price
                            </label>
                            <input
                                type="number"
                                className="form-control"
                                id="ticket_price"
                                name="ticket_price"
                                value={newEvent.ticket_price}
                                onChange={handleChange}
                            />
                        </div>
                        <button type="button" className="btn btn-primary" onClick={handleCreateEvent}>
                            Create
                        </button>
                        <button type="button" className="btn btn-secondary ms-2" onClick={closeCreateModal}>
                            Close
                        </button>
                    </form>
                </div>
            </Modal>
            <Modal
                isOpen={isEditModalOpen}
                onRequestClose={closeEditModal}
                contentLabel="Edit Event Modal"
                shouldCloseOnOverlayClick={false}  // Prevent closing on overlay click
                shouldCloseOnEsc={false}  // Prevent closing on Escape key
                className={{
                    base: 'custom-modal',
                    afterOpen: 'custom-modal-content',
                    beforeClose: 'custom-modal-content',
                }}
                overlayClassName={{
                    base: 'custom-modal-overlay',
                    afterOpen: 'custom-modal-overlay',
                    beforeClose: 'custom-modal-overlay',
                }}
            >
                <div>
                    <h2>Edit Event</h2>
                    <form>
                        <div className="mb-3">
                            <label htmlFor="title" className="form-label">
                                Title
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="title"
                                name="title"
                                value={newEvent.title}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="description" className="form-label">
                                Description
                            </label>
                            <textarea
                                className="form-control"
                                id="description"
                                name="description"
                                value={newEvent.description}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="capacity" className="form-label">
                                Capacity
                            </label>
                            <input
                                type="number"
                                className="form-control"
                                id="capacity"
                                name="capacity"
                                value={newEvent.capacity}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="ticket_price" className="form-label">
                                Ticket Price
                            </label>
                            <input
                                type="number"
                                className="form-control"
                                id="ticket_price"
                                name="ticket_price"
                                value={newEvent.ticket_price}
                                onChange={handleChange}
                            />
                        </div>
                        <h4>Event Images:</h4>
                        <Row>
                            {editEvent?.imagesIds && Array.isArray(editEvent.imagesIds) ? (
                                editEvent.imagesIds.map((imageId: string) => (
                                    <Col md={3} key={imageId}>
                                        <Card className="mb-3">
                                            <Image src={`${API_URL}/image/${imageId}`} alt={`Event Image ${imageId}`}
                                                   fluid style={{objectFit: 'cover', height: '100px'}}/>
                                            <Card.Body className="d-flex flex-column align-items-center">
                                                <Link to={`${API_URL}/image/${imageId}`}
                                                      className="btn btn-success mt-3">
                                                    Посмотреть
                                                </Link>
                                                <Button variant="danger" onClick={() => handleDeleteImage(imageId)}
                                                        className="mt-2">
                                                    Удалить
                                                </Button>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))
                            ) : (
                                <Col md={12}>This event has no pictures</Col>
                            )}
                        </Row>
                        <Row>
                            <UploadEventPicture eventId={selectedEventId!}/>
                        </Row>

                        <div className="d-flex flex-column mt-3">
                            <button type="button" className="btn btn-primary flex-grow-1" onClick={handleEditEvent}>
                                Save
                            </button>
                            <button type="button" className="btn btn-secondary flex-grow-1 mt-2"
                                    onClick={closeEditModal}>
                                Close
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
};

export default observer(Events);