import {User} from "../model/user/User.ts";
import {api} from "./Common.ts";

export const fetchUser = async (username : string) : Promise<User> => {
    return api<User>('/user/' + username + '/get');
}

export const fetchUserByLoginToken = async (loginToken : string) : Promise<User> => {
    return api<User>('/user/' + loginToken + '/byLoginToken');
}