import React, {FC, useContext, useState} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import './Auth.css'
import {Link} from "react-router-dom";

const Login: FC = () => {
    const [email,setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const {store} = useContext(Context);
    return (
        <div className="body-auth">
        <div className='container-auth'>
            <h2>Login</h2>
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
            <button className='button' onClick={() => store.login(email, password)}>
                Login
            </button>
            <p className="link">
                Don't have an account? <Link to = {'/signup'}>Sign up</Link>
            </p>
        </div>
        </div>
    );
};

export default observer(Login);