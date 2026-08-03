import {api} from "./Common.ts";
import {Category} from "../model/page/Category.ts";
import {Page} from "../model/page/Page.ts";

export const fetchCategories = async (page: number | null, pageSize: number | null): Promise<Category[]> => {
    const query = new URLSearchParams({page: String(page), pageSize: String(pageSize)}).toString();
    return api<Category[]>('/category/all?' + query);
}

export const fetchCategory = async (category: string): Promise<Category> => {
    return api<Category>('/category/get/' + encodeURIComponent(category));
}

export const findCategories = async (query: string): Promise<Category[]> => {
    return api<Category[]>('/category/find/' + encodeURIComponent(query));
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
    return api<string>('/category/delete/' + encodeURIComponent(category), {
        method: 'DELETE',
        token,
    });
}

export const findPagesInCategory = async (category: string, page: number, pageSize: number): Promise<Page[]> => {
    const query = new URLSearchParams({page: String(page), pageSize: String(pageSize)}).toString();
    return api<Page[]>('/category/findPages/' + encodeURIComponent(category) + '?' + query);
}