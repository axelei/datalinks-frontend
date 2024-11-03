import {User} from "../model/user/User.ts";

export const fetchUser = async (username : string) : Promise<User> => {
    const data = await fetch(import.meta.env.VITE_API + '/user/' + username + '/get');
    if (data.ok) {
        return data.json();
    } else {
        return Promise.reject(data.status);
    }
}

export const fetchUserByLoginToken = async (loginToken : string) : Promise<User> => {
    const data = await fetch(import.meta.env.VITE_API + '/user/' + loginToken + '/byLoginToken');
    if (data.ok) {
        return data.json();
    } else {
        return Promise.reject(data.status);
    }
}