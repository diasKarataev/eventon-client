import React, {FC, useContext, useEffect, useState} from 'react';
import LoginForm from "./components/LoginForm";
import {Context} from "./index";
import {observer} from "mobx-react-lite";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";



const App: React.FC = () => {
    const {store} = useContext(Context);

    useEffect(() => {
        console.log("useEffect is running");
        if (localStorage.getItem('token')) {
            store.checkAuth();
        }
    }, []);

    if (store.isLoading) {
        return <div>Загрузка...</div>
    }

    if (!store.isAuth) {
        return (
            <div>
                <LoginForm/>
            </div>
        );
    }
    return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home/>}/>
        </Routes>
    </BrowserRouter>
    );
};

export default observer(App);
