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

import './Profile.css';
import { Context } from '../index';
import { TbArrowBackUp } from "react-icons/tb";

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
        <>
            <div className="container-profile">
                <div className="back-link"><a href='/'><TbArrowBackUp/></a></div>
                <h1>Profile Page</h1>
                <div className="profile-info">
                    <div className="profile-picture">
                        {userData?.profilePictureId != null ? (
                        <img src={`${API_URL}/image/${userData.profilePictureId}`} alt="Profile" />
                        ) : (
                            <p>No profile picture</p>
                        )}
                    </div>
                    <div className="profile-details">
                        <p>Email: {userData?.email}</p>
                        <p>Name: Eren</p>
                        <p>Surname: Yeager</p>
                        <p>Password: Infinitive123</p>

                        <div className="role-button">
                            {store.user.role === 'ADMIN' ? (
                                <button className="admin-button" onClick={handleMakeUser}>Make User</button>
                            ) : (
                                <button className="user-button" onClick={handleMakeAdmin}>Make Admin</button>
                            )}
                        </div>

                    </div>
                </div>
                <UploadProfilePicture/>
                <h2 className='ticket-header'>Tickets</h2>
                <div className="ticket-container">
                    {userTickets.map((ticket, index) => (
                        <div className="ticket" key={ticket.id}>
                            <h4>{eventNames[index]}</h4>
                            <QRCode className="qr-code" value={API_URL + '/tickets/check-ticket/' + ticket.activationLink} />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default observer(ProfilePage);
