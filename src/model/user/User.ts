import {UserLevel} from "./UserLevel.ts";

export interface User {
    username: string;
    email: string;
    name: string;
    userLevel : UserLevel;
}