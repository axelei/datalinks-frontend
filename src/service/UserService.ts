import {User} from "../model/user/User.ts";
import {api} from "./Common.ts";

export const fetchUser = async (username : string) : Promise<User> => {
    return api<User>('/user/' + encodeURIComponent(username) + '/get');
}

export const fetchUserByLoginToken = async (loginToken : string) : Promise<User> => {
    return api<User>('/user/' + encodeURIComponent(loginToken) + '/byLoginToken');
}

export const login = async (username: string, password: string): Promise<string> => {
    const data = await fetch(import.meta.env.VITE_API + '/user/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, password}),
    });
    if (data.ok) {
        return data.json();
    } else if (data.status == 404) {
        return Promise.reject(404);
    } else {
        return Promise.reject(500);
    }
}

export interface SignupInputs {
    username: string;
    password: string;
    passwordAgain?: string;
    email: string;
    name?: string;
    captcha?: string | null;
    language?: string;
}

export const signup = async (inputs: SignupInputs): Promise<string> => {
    const data = await fetch(import.meta.env.VITE_API + '/user/signup', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(inputs),
    });
    if (data.ok) {
        return data.text();
    } else {
        return Promise.reject(data.text());
    }
}

export interface PasswordResetRequestInputs {
    username: string;
    email: string;
    captcha?: string | null;
}

export const requestPasswordReset = async (inputs: PasswordResetRequestInputs): Promise<string> => {
    const data = await fetch(import.meta.env.VITE_API + '/user/requestReset', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(inputs),
    });
    if (data.ok) {
        return data.text();
    } else {
        return Promise.reject(data.text());
    }
}

export const resetPassword = async (resetToken: string): Promise<string> => {
    const data = await fetch(import.meta.env.VITE_API + '/user/' + encodeURIComponent(resetToken) + '/reset');
    if (data.ok) {
        return data.text();
    } else {
        return Promise.reject('');
    }
}

export const activateUser = async (activationToken: string): Promise<string> => {
    const data = await fetch(import.meta.env.VITE_API + '/user/' + encodeURIComponent(activationToken) + '/activate');
    if (data.ok) {
        return data.text();
    } else {
        return Promise.reject('');
    }
}

export const changePassword = async (password: string, token: string): Promise<string> => {
    const data = await fetch(import.meta.env.VITE_API + '/user/passwordChange', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        },
        body: password,
    });
    if (data.ok) {
        return data.text();
    } else {
        return Promise.reject(data.text());
    }
}