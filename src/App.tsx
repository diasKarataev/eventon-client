import React, { FC, useContext, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import Login from './components/Login';
import Signup from './components/Signup';
import { Context } from './index';
import Home from './pages/Home';
import EventPage from './pages/EventPage';
import ProfilePage from './pages/Profile';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminPage from './pages/AdminPage';
import Dashboard from "./components/admin/Dashboard";
import Users from "./components/admin/Users";
import Events from "./components/admin/Events";
import Orders from "./components/admin/Orders";
import Mailing from "./components/admin/Mailing";


const App: FC = () => {
    const { store } = useContext(Context);

    useEffect(() => {
        if (localStorage.getItem('token')) {
            store.checkAuth();
        }
    }, [store]);
    if (store.isLoading) {
        return <div>Загрузка...</div>;
    }



    const { pathname } = window.location;

    return (
        <BrowserRouter>
            {store.isAuth && (pathname !== '/admin' && !pathname.startsWith('/admin/')) && <Navbar />}
            <Routes>
                <Route path="/admin/*" element={<AdminPage />}>
                    <Route path="" element={<Navigate to="/admin/dashboard" />} />
                    <Route path="events" element={<Events />} />
                    <Route path="users" element={<Users />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="mailing" element={<Mailing />} />
                    <Route path="dashboard" element={<Dashboard />} />
                </Route>
                <Route path="/" element={<Home />} />
                <Route path="/events/:eventId" element={<EventPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                {!store.isAuth && (
                    <>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/" element={<Navigate to="/login" />} />
                    </>
                )}
                {/* Redirect to home if the route is not matched */}
                <Route path="/*" element={<Navigate to="/" />} />
            </Routes>
            {store.isAuth && (pathname !== '/admin' && !pathname.startsWith('/admin/')) && <Footer />}
        </BrowserRouter>
    );
};

export default observer(App);