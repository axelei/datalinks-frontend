import {Category} from "./Category.ts";

export interface Page {
    title: string;
    content: string;
    categories: Category[];
}
