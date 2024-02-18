import React, {FC, useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { IUser } from '../../models/iUser';
import UserService from '../../services/UserService';
import Modal from 'react-modal'
import {Button, Card, Col, Image, Row} from "react-bootstrap";
import {API_URL} from "../../http";
import './Events.css';
import {IUserInformation} from "../../models/IUserInformation";
import {ICreateUser} from "../../models/ICreateUser";



const Users: FC = () => {
    const [users, setUsers] = useState<IUserInformation[]>([]);
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [newUser, setNewUser] = useState<ICreateUser>({
        email: '',
        role: 'USER',
        password: '',
        name: '',
        surname: '',
        birthDate: '',
        roleOptions: ['ADMIN', 'USER']
    });
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [editUser, setEditUser] = useState<IUserInformation | null>(null);

    const openEditModal = async (userId: string) => {
        try {
            setSelectedUserId(userId);
            const response = await UserService.getUserById(userId);
            setEditUser(response.data);

            setNewUser({
                ...newUser,
                email: response.data.email,
                role: response.data.role,
                name: response.data.name,
                surname: response.data.surname,
                birthDate: response.data.birthDate,
            });

            setEditModalOpen(true);
        } catch (error) {
            console.error('Error fetching user data for editing:', error);
        }
    };

    const closeEditModal = () => {
        setSelectedUserId(null);
        setEditUser(null);
        setEditModalOpen(false);
    };

    const handleEditUser = async () => {
        try {
            const updatedUser = { ...newUser };
            if (!updatedUser.password.trim()) {
                updatedUser.password = 'null';
            }

            if (selectedUserId && editUser) {
                await UserService.updateUser(selectedUserId, updatedUser);
                closeEditModal();
                fetchUsers();
            }
        } catch (e) {
            console.log(e);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const handleCreateUser = async () => {
        try {
            await UserService.createUser(newUser);
            closeCreateModal();
            fetchUsers();
        } catch (e) {
            console.log(e);
        }
    };
    const openCreateModal = () => {
        setNewUser({
            email: '',
            role: 'USER',
            password: '',
            name: '',
            surname: '',
            birthDate: '',
            roleOptions: ['ADMIN', 'USER']
        });
        setCreateModalOpen(true);
    };
    const closeCreateModal = () => {
        setCreateModalOpen(false);
    };

    const fetchUsers = async () => {
        try {
            const response = await UserService.fetchUsers();
            setUsers(response.data);
        } catch (e) {
            console.log(e);
        }
    };

    const handleDelete = async (userId: string) => {
        try {
            await UserService.deleteUser(userId);
            fetchUsers();
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        fetchUsers();
        const fetchEditUserData = async () => {
            try {
                if (selectedUserId) {
                    const response = await UserService.getUserById(selectedUserId);
                    setEditUser(response.data);
                }
            } catch (error) {
                console.error('Error fetching edit user data:', error);
            }
        };

        fetchEditUserData();
    }, [selectedUserId]);


    return (
        <div>
            {isEditModalOpen && <div className="white-overlay"></div>}
            {isCreateModalOpen && <div className="white-overlay"></div>}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>Users</h1>
                <button className="btn btn-success" onClick={openCreateModal}>
                    Create User
                </button>
            </div>
            <table className="table">
                <thead>
                <tr>
                    <th>Email</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user._id}>
                        <td>{user.email}</td>
                        <td>
                            <button className="btn btn-primary" onClick={() => openEditModal(user._id)}>
                                Edit
                            </button>
                            <button className="btn btn-danger ms-2" onClick={() => handleDelete(user._id)}>
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <Modal
                isOpen={isCreateModalOpen}
                onRequestClose={closeCreateModal}
                contentLabel="Create User Modal"
                shouldCloseOnOverlayClick={false} // Prevent closing on overlay click
                shouldCloseOnEsc={false} // Prevent closing on Escape key
                className={{
                    base: 'custom-modal',
                    afterOpen: 'custom-modal-content',
                    beforeClose: 'custom-modal-content',
                }}
                overlayClassName={{
                    base: 'custom-modal-overlay',
                    afterOpen: 'custom-modal-overlay',
                    beforeClose: 'custom-modal-overlay',
                }}
            >
                <div>
                    <h2>Create User</h2>
                    <form>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">
                                Email
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="email"
                                name="email"
                                value={newUser.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">
                                Name
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                name="name"
                                value={newUser.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="surname" className="form-label">
                                Surname
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="surname"
                                name="surname"
                                value={newUser.surname}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="birthDate" className="form-label">
                                Birthdate
                            </label>
                            <input
                                type="date"
                                className="form-control"
                                id="birthDate"
                                name="birthDate"
                                value={newUser.birthDate}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">
                                Password
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="password"
                                name="password"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="role" className="form-label">
                                Role
                            </label>
                            <select
                                className="form-select"
                                id="role"
                                name="role"
                                value={newUser.role}
                                onChange={handleChange}
                            >
                                {newUser.roleOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button type="button" className="btn btn-primary" onClick={handleCreateUser}>
                            Create
                        </button>
                        <button type="button" className="btn btn-secondary ms-2" onClick={closeCreateModal}>
                            Close
                        </button>
                    </form>
                </div>
            </Modal>
            <Modal
                isOpen={isEditModalOpen}
                onRequestClose={closeEditModal}
                contentLabel="Edit User Modal"
                shouldCloseOnOverlayClick={false} // Prevent closing on overlay click
                shouldCloseOnEsc={false} // Prevent closing on Escape key
                className={{
                    base: 'custom-modal',
                    afterOpen: 'custom-modal-content',
                    beforeClose: 'custom-modal-content',
                }}
                overlayClassName={{
                    base: 'custom-modal-overlay',
                    afterOpen: 'custom-modal-overlay',
                    beforeClose: 'custom-modal-overlay',
                }}
            >
                <div>
                <h2>Edit User</h2>
                    <form>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">
                                Email
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="email"
                                name="email"
                                value={newUser.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">
                                Name
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                name="name"
                                value={newUser.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="surname" className="form-label">
                                Surname
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="surname"
                                name="surname"
                                value={newUser.surname}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="birthDate" className="form-label">
                                Birthdate
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="birthDate"
                                name="birthDate"
                                value={newUser.birthDate}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">
                            Password
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="password"
                                name="password"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="role" className="form-label">
                                Role
                            </label>
                            <select
                                className="form-select"
                                id="role"
                                name="role"
                                value={newUser.role}
                                onChange={handleChange}
                            >
                                {newUser.roleOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <h4>User Profile Image:</h4>
                        <Row>
                            {editUser?.profilePictureId ? (
                                <Col md={3}>
                                    <Card className="mb-3">
                                        <Image
                                            src={`${API_URL}/image/${editUser.profilePictureId}`}
                                            alt={`User Profile Image`}
                                            fluid
                                            style={{objectFit: 'cover', height: '100px'}}
                                        />
                                    </Card>
                                </Col>
                            ) : (
                                <Col md={12}>This user has no profile picture</Col>
                            )}
                        </Row>

                        <div className="d-flex flex-column mt-3">
                            <button type="button" className="btn btn-primary flex-grow-1" onClick={handleEditUser}>
                                Save
                            </button>
                            <button type="button" className="btn btn-secondary flex-grow-1 mt-2"
                                    onClick={closeEditModal}>
                                Close
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
};

export default observer(Users);