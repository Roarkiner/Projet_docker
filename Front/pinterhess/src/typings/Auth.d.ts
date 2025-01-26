export type LoginRequestModel = {
    login: string;
    password: string;
}

export type RegisterRequestModel = {
    name: string;
    login: string;
    password: string;
}

export interface User {
    Id: number;
    Login: string;
    Nom: string;
}