import {Category} from "./Category.ts";
import {UserLevel} from "../user/UserLevel.ts";

export interface Page {
    title: string;
    content: string;
    summary?: string;
    slug?: string;
    categories?: Category[];
    block?: UserLevel;
    creationDate?: Date;
    modifiedDate?: Date;
    creatorName?: string;
}

export const newPage = (title: string) : Page => {
    return {
        title: title,
        content: '',
        categories: []
    };
}