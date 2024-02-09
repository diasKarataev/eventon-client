import $api from "../http";
import {AxiosResponse} from 'axios';
import {IUser} from "../models/iUser";
import {IUserInformation} from "../models/IUserInformation";
import {ICreateUser} from "../models/ICreateUser";
import {ITicket} from "../models/iTicket";

export default class UserService {
    static fetchUsers() : Promise<AxiosResponse<IUserInformation[]>>{
        return $api.get<IUserInformation[]>('/users');
    }
    static getUserById(userId: string): Promise<AxiosResponse<IUserInformation>> {
        return $api.get<IUserInformation>(`/users/${userId}`);
    }

    static deleteUser(userId: string): Promise<AxiosResponse> {
        return $api.delete(`/users/${userId}`);
    }
    static createUser(userData: ICreateUser): Promise<AxiosResponse<IUser>> {
        return $api.post(`/users`, userData);
    }
    static updateUser(userId: string, userData: ICreateUser): Promise<AxiosResponse> {
        return $api.patch(`/users/${userId}`, userData);
    }
    static getProfile() : Promise<AxiosResponse<IUserInformation>>{
        return $api.get<IUserInformation>(`/users/profile`);
    }
    static getTickets() : Promise<AxiosResponse<ITicket[]>>{
        return $api.get<ITicket[]>(`/tickets/mytickets`);
    }

    static uploadImage(file: File): Promise<AxiosResponse> {
        const formData = new FormData();
        formData.append('image', file);
        return $api.post(`/image/user`, formData);
    }
}