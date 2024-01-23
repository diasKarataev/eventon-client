// Home.tsx
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Context } from '../index';
import EventService from '../services/EventService';
import { observer } from 'mobx-react-lite';
import { IEvent } from '../models/iEvent';
import {API_URL} from "../http";

const Home: React.FC = () => {
    const { store } = useContext(Context);
    const [events, setEvents] = useState<IEvent[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await EventService.getEvents();
                setEvents(response.data);
            } catch (e) {
                console.log(e);
            }
        }

        fetchData();
    }, []);

    return (
        <div>
            <h1>{store.isAuth ? `Пользователь авторизован ${store.user.email}` : 'АВТОРИЗУЙТЕСЬ'}</h1>
            <h1>{store.user.isActivated ? 'Аккаунт подтвержден по почте' : 'ПОДТВЕРДИТЕ АККАУНТ!!!!'}</h1>
            <button className="btn btn-primary" onClick={() => store.logout()}>Выйти</button>

            {/* Добавление ссылки на личный кабинет */}
            {store.isAuth && (
                <div>
                    <Link to="/profile">Личный кабинет</Link>
                </div>
            )}

            <div>
                {events.map(event => (

                    <div key={event._id}>
                        <Link to={`/events/${event._id}`}>{event.title}
                            {event.imagesIds.length >= 1 ? (<p><img src={`${API_URL}/image/${event.imagesIds.at(0)}`}
                                                                    alt={`Event Image {event.imagesIds.at(0)}`}/></p>) : ('')}
                        </Link>
                    </div>

                ))}
            </div>
        </div>
    );
};

export default observer(Home);
