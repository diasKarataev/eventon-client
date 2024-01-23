import React, {FC, useContext, useEffect, useState} from 'react';
import LoginForm from "./components/LoginForm";
import {Context} from "./index";
import {observer} from "mobx-react-lite";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import EventPage from "./pages/EventPage";
import ProfilePage from "./pages/Profile";
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from "./components/Navbar";



const App: React.FC = () => {
    const {store} = useContext(Context);

    useEffect(() => {
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
        <Navbar></Navbar>
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/events/:eventId" element={<EventPage />} />
            <Route path="/profile" element={<ProfilePage />} />
        </Routes>
    </BrowserRouter>
    );
};

export default observer(App);
