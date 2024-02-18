import React, { FC, useState } from 'react';
import { observer } from 'mobx-react-lite';
import StatsService from '../../services/StatsService';

const Mailing: FC = () => {
    const [message, setMessage] = useState('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await StatsService.sendMail(message);
            console.log('Mail sent successfully');
        } catch (error) {
            console.error('Error sending mail:', error);
        }
    };

    return (
        <div>
            <h1>Mailing</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    className="form-control form-control-lg mb-3"
                    id="messageInput"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter your message here"
                />
                <button type="submit" className="btn btn-primary">Send</button>
            </form>
        </div>
    );
};

export default observer(Mailing);