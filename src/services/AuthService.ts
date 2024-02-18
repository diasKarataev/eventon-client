import $api from "../http";
import {AxiosResponse} from 'axios';
import {AuthResponse} from "../models/AuthResponse";

export default class AuthService {
    static async login(email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>('/auth/login', {email, password})
    }

    static async registration(email: string, password: string, name: string, surname: string, birthDate: Date): Promise<AxiosResponse<AuthResponse>> {
        // Include the missing parameters in the request body
        return $api.post<AuthResponse>('/auth/registration', { email, password, name, surname, birthDate });
    }

    static async logout(): Promise<void> {
        return $api.post('/auth/logout')
    }

}

