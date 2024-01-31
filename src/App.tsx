import React, {FC, useContext, useEffect, useState} from 'react';
import Login from "./components/Login";
import Signup from './components/Signup';
import {Context} from "./index";
import {observer} from "mobx-react-lite";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from "./pages/Home";
import EventPage from "./pages/EventPage";
import ProfilePage from "./pages/Profile";
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";



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

    return (
    <BrowserRouter>
        {store.isAuth ? <Navbar></Navbar> : ''}
        <Routes>
            <Route path="/" element={<Home/>}/>
                <Route path="/events/:eventId" element={<EventPage/>}/>
                <Route path="/profile" element={<ProfilePage/>}/>
                {!store.isAuth && (
                    <>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/signup" element={<Signup/>}/>
                        <Route path="/" element={<Navigate to="/login"/>}/>
                    </>
                )}
        </Routes>
        <Footer></Footer>
    </BrowserRouter>

    );
};

export default observer(App);
