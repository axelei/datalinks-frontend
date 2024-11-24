import {User} from "../user/User.ts";
import {Page} from "./Page.ts";

export interface Edit {
    id: string;
    page?: Page;
    content: string;
    date: Date;
    user?: User;
}
