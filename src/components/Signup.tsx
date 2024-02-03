import React, { FC, useContext, useState } from 'react';
import { Context } from '../index';
import { observer } from 'mobx-react-lite';
import './Auth.css';
import {Link} from "react-router-dom";

const Signup: FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [surname, setSurname] = useState<string>('');
    const [birthDate, setBirthDate] = useState<Date | null>(null);

    const { store } = useContext(Context);

    const handleSignup = () => {
        // Validate input fields before making the signup request
        if (!email || !password || !name || !surname || !birthDate) {
            // Handle validation error, e.g., show a message or disable the signup button
            return;
        }

        // Make the signup request with the additional fields
        store.registration(email, password, name, surname, birthDate);
    };

    return (
        <div className="body-auth">
            <div className="container-auth">
                <h2>Sign up</h2>
                <div className="input-group">
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        type="text"
                        placeholder="Email"
                    />
                </div>
                <div className="input-group">
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        type="text"
                        placeholder="Password"
                    />
                </div>
                <div className="input-group">
                    <input
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        type="text"
                        placeholder="Name"
                    />
                </div>
                <div className="input-group">
                    <input
                        onChange={(e) => setSurname(e.target.value)}
                        value={surname}
                        type="text"
                        placeholder="Surname"
                    />
                </div>
                <div className="input-group">
                    <input
                        onChange={(e) => setBirthDate(new Date(e.target.value))}
                        value={birthDate ? birthDate.toISOString().split('T')[0] : ''}
                        type="date"
                        placeholder="Birth Date"
                    />
                </div>
                <button className="button" onClick={handleSignup}>
                    Sign up
                </button>
                <p className="link">
                    Already have an account? <Link to = {'/login'}>Login</Link>
                </p>
            </div>
        </div>
    );
};

export default observer(Signup);
