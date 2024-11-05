import {UserLevel} from "./UserLevel.ts";

export interface User {
    username: string;
    email: string;
    name: string;
    userLevel : UserLevel;
    creationDate: number;
    language?: string;
}

export const newUser = () : User => {
    return {
        email: "",
        name: "Anonymous IP",
        userLevel: UserLevel.guest,
        username: "AnonymousIP",
        creationDate: Date.now(),
    };
}