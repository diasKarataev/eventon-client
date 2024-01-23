import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import UserService from '../services/UserService';
import { IUserInformation } from '../models/IUserInformation';
import { ITicket } from '../models/iTicket';
import EventService from '../services/EventService';
import { observer } from 'mobx-react-lite';
import { API_URL } from '../http';
import QRCode from 'qrcode.react';
import UploadProfilePicture from "../components/UploadProfilePicture";
import {Context} from "../index"; // Import the QR code library

const ProfilePage: React.FC = () => {
    const { userId } = useParams<{ userId?: string }>();
    const [userData, setUserData] = useState<IUserInformation>();
    const [userTickets, setUserTickets] = useState<ITicket[]>([]);
    const [eventNames, setEventNames] = useState<string[]>([]);
    const { store } = useContext(Context);

    useEffect(() => {
        async function fetchEventData() {
            try {
                const userData = await UserService.getProfile();
                const userTickets = await UserService.getTickets();
                setUserData(userData.data);
                setUserTickets(userTickets.data);

                // Fetch event names for each ticket
                const names = await Promise.all(userTickets.data.map((ticket) => getEventNameById(ticket.event)));
                setEventNames(names);
            } catch (error) {
                console.error('Error fetching event data:', error);
            }
        }

        fetchEventData();
    }, [userId]);

    const getEventNameById = async (eventId: string) => {
        try {
            const event = await EventService.getEventById(eventId);
            return event.data.title;
        } catch (error) {
            console.error(`Error fetching event with id ${eventId}:`, error);
            return 'Unknown Event';
        }
    };

    const handleMakeAdmin = async () => {
        try {
            await UserService.makeAdmin();
            // You might want to refresh the user data or take other actions
            window.location.reload();
        } catch (error) {
            console.error('Error making user an admin:', error);
        }
    };

    const handleMakeUser = async () => {
        try {
            await UserService.makeUser();
            // You might want to refresh the user data or take other actions
            window.location.reload();
        } catch (error) {
            console.error('Error making user a regular user:', error);
        }
    };


    return (
        <div>
            <h1>Profile Page</h1>
            {userData ? (
                <div>
                    <p>Email: {userData.email}</p>
                    <p>Profile Picture:</p>
                    <p>{store.user.role}</p>
                    {userData.profilePictureId != null ? (
                        <p><img src={`${API_URL}/image/${userData.profilePictureId}`} alt="Profile"/></p>
                    ) : (
                        <p>No profile picture</p>
                    )}

                    {store.user.role === 'ADMIN' ? (
                        <button onClick={handleMakeUser}>Стать юзером</button>
                    ) : (
                        <button onClick={handleMakeAdmin}>Хочу быть стать админом!</button>
                    )}
                    <p><Link to="/">Back</Link></p>
                </div>
            ) : (
                <p>...</p>
            )}
            <UploadProfilePicture></UploadProfilePicture>
            <h2>Tickets</h2>
            <div>
                {userTickets.map((ticket, index) => (
                    <div key={ticket.id}>
                        <p>Билет на</p>
                        <p>{eventNames[index]}</p>
                        <QRCode value={API_URL + '/tickets/check-ticket/' + ticket.activationLink}/>
                    </div>
                ))}

            </div>
        </div>
    );
};

export default observer(ProfilePage);
