export type LoginRequestModel = {
    email: string;
    password: string;
}

export type RegisterRequestModel = {
    name: string;
    email: string;
    password: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
}