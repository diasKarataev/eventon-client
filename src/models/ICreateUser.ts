export interface ICreateUser {
    email: string;
    role: string;
    password: string;
    name: string;
    surname: string;
    birthDate: string;
    roleOptions: string[]
}