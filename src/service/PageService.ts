import {Page} from "../model/page/Page.ts";
import {api, log} from "./Common.ts";

export const fetchPageShort = async (title: string, token: string) : Promise<Page> => {
    log("Fetching pageshort: " + title);
    return api<Page>('/page/-short/' + encodeURIComponent(title), { token });
}

export const fetchPage = async (title: string, token : string): Promise<Page> => {
    log("Fetching page: " + title);
    return api<Page>('/page/' + encodeURIComponent(title), { token });
}

export const savePage = async (pageTemp : Page, token : string): Promise<string> => {
    log("Saving page: " + pageTemp.title);
    return api<string>('/page/' + encodeURIComponent(pageTemp.title), {
        method: 'PUT',
        token,
        contentType: 'application/json',
        body: JSON.stringify({
            content: pageTemp.content,
            categories: pageTemp.categories,
        }),
    });
}

export const deletePage = async (page : Page, token : string): Promise<string> => {
    log("Deleting page: " + page.title);
    return api<string>('/page/' + encodeURIComponent(page.title), {
        method: 'DELETE',
        token,
        contentType: 'text/plain',
    });
}

export const blockPage = async (page : Page, readBlock : string, writeBlock : string, token : string): Promise<string> => {
    log("Blocking page: " + page.title);
    const query = new URLSearchParams({readBlock, writeBlock}).toString();
    return api<string>('/page/block/' + encodeURIComponent(page.title) + '?' + query, {
        method: 'POST',
        token,
        contentType: 'text/plain',
    });
}

export const fetchRandomPage = async (): Promise<Page> => {
    log("Fetching random page: ");
    return api<Page>('/page/-randomPage');
}

export const fetchNewPages = async (page : number, pageSize : number): Promise<Page[]> => {
    log("Fetching new pages: ");
    return api<Page[]>('/page/newPages', {
        method: 'POST',
        contentType: 'application/json',
        body: JSON.stringify({page, pageSize}),
    });
}