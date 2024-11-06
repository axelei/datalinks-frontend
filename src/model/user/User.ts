import {UserLevel} from "./UserLevel.ts";

export interface User {
    username: string;
    email: string;
    name: string;
    level : UserLevel;
    creationDate: number;
    language?: string;
}

export const newUser = () : User => {
    return {
        email: "",
        name: "Anonymous IP",
        level: UserLevel.GUEST,
        username: "AnonymousIP",
        creationDate: Date.now(),
    };
}