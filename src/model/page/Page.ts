import {Category} from "./Category.ts";
import {UserLevel} from "../user/UserLevel.ts";

export interface Page {
    title: string;
    content: string;
    categories: Category[];
    block?: UserLevel;
    creationDate?: number;
}

export const newPage = (title: string) : Page => {
    return {
        title: title,
        content: '',
        categories: []
    };
}