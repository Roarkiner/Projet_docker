export type LoginRequestModel = {
    login: string;
    mdp: string;
}

export type RegisterRequestModel = {
    login: string;
    nom: string;
    mdp: string;
}

export interface User {
    id: number;
    login: string;
    nom: string;
}