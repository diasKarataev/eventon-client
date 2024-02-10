export interface IUserInformation {
    _id: string,
    email: string,
    password: string,
    activationLink: string,
    profilePictureId: string,
    name: string,
    surname: string,
    birthDate: string;
    role: string;
    isSubscribed: boolean;
}