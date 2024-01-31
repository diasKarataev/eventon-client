import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Context } from '../index';
import EventService from '../services/EventService';
import { observer } from 'mobx-react-lite';
import { IEvent } from '../models/iEvent';
import { API_URL } from '../http';

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
      <div className="album py-5 bg-body">
        <div className="container">
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
        {events.map((event) => (
          <div key={event._id}>
            <Link to={`/events/${event._id}`}>
              <div className="col-md-4">
                  <div className="col" style={{width: '400px'}}>
                      <div className="card shadow-sm">
                          <div className="bd-placeholder-img card-img-top"
                               style={{height: '225px', overflow: 'hidden'}}>
                              {event.imagesIds.length >= 1 ? (
                                  <img
                                      src={`${API_URL}/image/${event.imagesIds.at(0)}`}
                                      alt={`Event Image {event.imagesIds.at(0)}`}
                                      className="img-fluid"
                                      style={{width: '100%', height: '100%', objectFit: 'cover'}}
                                  />
                              ) : (
                                  <div style={{
                                      display: 'flex',
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                      height: '100%'
                                  }}>This event has no pictures</div>
                              )}
                          </div>
                          <div className="card-body">
                              <p className="card-text"></p>
                              <div className="d-flex justify-content-between align-items-center">
                                  <h4>{event.title} </h4>
                                  <small className="text-body-secondary">Подробнее...</small>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
      </div>
      </div>
  );
};
export default observer(Home);
