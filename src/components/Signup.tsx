import React, {FC, useContext, useState} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import './Auth.css'

const Signup: FC = () => {
    const [email,setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const {store} = useContext(Context);
    return (
        <div className="body-auth">
        <div className='container-auth'>
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
                    onChange={e => setPassword(e.target.value)}
                    value={password}
                    type="text"
                    placeholder="password"
                />
            </div>
            <button className='button' onClick={() => store.registration(email, password)}>
                Sign up
            </button>
            <p className="link">
                Already have an account? <a href="/login">Login</a>
            </p>
        </div>
        </div>
    );
};

export default observer(Signup);