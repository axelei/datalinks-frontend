import {Page} from "../model/page/Page.ts";
import {log} from "./Common.ts";

export const fetchPageShort = async (title: string, token: string) : Promise<Page> => {
    log("Fetching pageshort: " + title);
    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token,
        },
    };
    const data = await fetch(import.meta.env.VITE_API + '/page/-short/' + title, requestOptions);
    if (data.ok) {
        return data.json();
    } else {
        return Promise.reject(data.status);
    }
}

export const fetchPage = async (title: string, token : string): Promise<Page> => {
    log("Fetching page: " + title);
    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token,
        },
    }
    const data = await fetch(import.meta.env.VITE_API + '/page/' + title, requestOptions);
    if (data.ok) {
        return data.json();
    } else {
        return Promise.reject(data.status);
    }
}

export const savePage = async (pageTemp : Page, token : string): Promise<string> => {
    log("Saving page: " + pageTemp.title);
    const requestOptions = {
        method: 'PUT',
        headers: {
            'Content-Type': 'text/plain',
            'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({
            content: pageTemp.content,
            categories: pageTemp.categories,
        }),
    };
    const data = await fetch(import.meta.env.VITE_API + '/page/' + pageTemp.title, requestOptions);
    if (data.ok) {
        return data.text();
    } else {
        return Promise.reject(data.status);
    }
}

export const deletePage = async (page : Page, token : string): Promise<string> => {
    log("Deleting page: " + page.title);
    const requestOptions = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'text/plain',
            'Authorization': 'Bearer ' + token,
        },
    };
    const data = await fetch(import.meta.env.VITE_API + '/page/' + page.title, requestOptions);
    if (data.ok) {
        return data.text();
    } else {
        return Promise.reject(data.status);
    }
}

export const blockPage = async (page : Page, readBlock : string, writeBlock : string, token : string): Promise<string> => {
    log("Blocking page: " + page.title);
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain',
            'Authorization': 'Bearer ' + token,
        },
    };
    const data = await fetch(import.meta.env.VITE_API + '/page/block/' + page.title + '?readBlock=' + readBlock + "&writeBlock=" + writeBlock, requestOptions);
    if (data.ok) {
        return data.text();
    } else {
        return Promise.reject(data.status);
    }
}