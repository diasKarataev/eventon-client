import $api from "../http";
import {AxiosResponse} from 'axios';
import {IUser} from "../models/iUser";
import {IUserInformation} from "../models/IUserInformation";
import {ITicket} from "../models/iTicket";

export default class UserService {
    static fetchUsers() : Promise<AxiosResponse<IUser[]>>{
        return $api.get<IUser[]>('/users');
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

    static makeAdmin() : Promise<AxiosResponse<AxiosResponse>>{
        return $api.get<AxiosResponse>(`/users/admin`);
    }
    static makeUser() : Promise<AxiosResponse<AxiosResponse>>{
        return $api.get<AxiosResponse>(`/users/user`);
    }
}