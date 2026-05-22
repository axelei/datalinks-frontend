import {api} from "./Common.ts";
import {Category} from "../model/page/Category.ts";

export const fetchCategories = async (page: number | null, pageSize: number | null): Promise<Category[]> => {
    return api<Category[]>('/category/all?page=' + page + '&pageSize=' + pageSize);
}

export const fetchCategory = async (category: string): Promise<Category> => {
    return api<Category>('/category/get/' + category);
}

export const findCategories = async (query: string): Promise<Category[]> => {
    return api<Category[]>('/category/find/' + query);
}

export const addCategory = async (category: string, token: string): Promise<string> => {
    return api<string>('/category/add', {
        method: 'PUT',
        token,
        contentType: 'text/plain',
        body: category,
    });
}

export const deleteCategory = async (category: string, token: string): Promise<string> => {
    return api<string>('/category/delete/' + category, {
        method: 'DELETE',
        token,
    });
}