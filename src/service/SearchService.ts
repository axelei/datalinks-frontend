import {api} from "./Common.ts";
import {Foundling} from "../model/search/Foundling.ts";

export const searchFull = async (query: string, page: number, pageSize: number): Promise<Foundling[]> => {
    const params = new URLSearchParams({page: String(page), pageSize: String(pageSize)}).toString();
    return api<Foundling[]>('/search/full/' + encodeURIComponent(query) + '?' + params);
}

export const titleSearch = async (query: string, token: string): Promise<Foundling[]> => {
    return api<Foundling[]>('/search/titleSearch/' + encodeURIComponent(query), {token});
}
