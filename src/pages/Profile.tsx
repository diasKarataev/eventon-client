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
    const handleResendActivation = async () => {
        try {
            await UserService.resendActivationLink();
            // Дополнительные действия после успешной отправки письма (если необходимо)
            console.log('Activation email sent successfully!');
        } catch (error) {
            console.error('Error resending activation email:', error);
        }
    };

    const toggleSubscription = async () => {
        try {
            await UserService.toggleSubscription(store.user.id);
            // Обновляем данные профиля после изменения подписки
            const updatedUserData = await UserService.getProfile();
            setUserData(updatedUserData.data);
        } catch (error) {
            console.error('Error toggling subscription:', error);
        }
    };

    const calculateAge = (birthDate: string | undefined): number | null => {
        if (!birthDate) return null;

        const birthDateObj = new Date(birthDate);
        const today = new Date();
        let age = today.getFullYear() - birthDateObj.getFullYear();
        const monthDiff = today.getMonth() - birthDateObj.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
            age--;
        }

        return age;
    };

    const handlePayment = async (ticket: string) => {
        try {
            const paymentLinkResponse = await EventService.getPaymentLink(ticket);
            if (paymentLinkResponse.data) {
                window.location.href = paymentLinkResponse.data;
            } else {
                console.error('Payment link not found in response:', paymentLinkResponse);
            }
        } catch (error) {
            console.error('Error getting payment link:', error);
        }
    };

    return (
        <>
            <div className="container-profile">
                <div className="back-link"><Link to={'/'}><TbArrowBackUp/></Link></div>
                <h1>Profile Page</h1>
                <div className="profile-info">
                    <div className="profile-picture">
                        {userData?.profilePictureId != null ? (
                            <img src={`${API_URL}/image/${userData.profilePictureId}`} alt="Profile"/>
                        ) : (
                            <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" alt="Profile"/>
                        )}
                    </div>
                    <div className="profile-details">
                        <p>Email: {userData?.email}</p>
                        <p>Name: {userData?.name}</p>
                        <p>Surname: {userData?.surname}</p>
                        {userData?.birthDate && (
                            <p>Age: {calculateAge(userData.birthDate)}</p>
                        )}
                        {store.user.role == "ADMIN" ? <p>Role: <a style={{color: 'red'}}>{store.user.role}</a></p> : ''}
                        {store.user.isActivated ? '' :<>
                            <p style={{color: 'red'}}>Активируйте аккаунт по почте</p>
                            <button onClick={handleResendActivation}>
                            Отправить на почту письмо с активацией
                            </button>
                        </>
                        }
                        <div>
                        <button onClick={toggleSubscription}>
                            {userData?.isSubscribed ? 'Отписаться от рассылки' : 'Подписаться на рассылку'}
                        </button>
                        </div>

                    </div>
                </div>
                <UploadProfilePicture/>
                <h2 className='ticket-header'>Tickets</h2>
                <div className="ticket-container">
                    {userTickets.length > 0 ? (
                        userTickets
                            .filter(ticket => ticket.isPaid && !ticket.isActivated)
                            .map((ticket, index) => (
                                <div className="ticket" key={ticket.id}>
                                    <>
                                        <h4>{eventNames[index]}</h4>
                                        <QRCode
                                            className="qr-code"
                                            value={API_URL + '/tickets/check-ticket/' + ticket.activationLink}
                                        />
                                    </>
                                </div>
                            ))
                    ) : (
                        <p style={{textAlign: 'center'}}>You have no tickets</p>
                    )}
                </div>
                <div>
                    {userTickets.some(ticket => !ticket.isPaid && !ticket.isActivated) && (
                        <h2 className='ticket-header'>Неоплаченные билеты:</h2>
                    )}
                    <div className="ticket-container">
                        {userTickets
                            .filter(ticket => !ticket.isPaid && !ticket.isActivated)
                            .map((ticket, index) => (
                                <div className="ticket" key={ticket.id}>
                                    <h4>{eventNames[index]}</h4>
                                    <button className="btn btn-success"
                                            onClick={() => handlePayment(ticket.id)}>
                                        Оплатить
                                    </button>
                                </div>
                            ))}
                    </div>
                </div>

            </div>
        </>
    );
};

export default observer(ProfilePage);
