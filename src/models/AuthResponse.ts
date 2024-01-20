import {IUser} from "./iUser";

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: IUser;
}