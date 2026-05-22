import {Page} from "../model/page/Page.ts";
import {api, log} from "./Common.ts";

export const fetchPageShort = async (title: string, token: string) : Promise<Page> => {
    log("Fetching pageshort: " + title);
    return api<Page>('/page/-short/' + title, { token });
}

export const fetchPage = async (title: string, token : string): Promise<Page> => {
    log("Fetching page: " + title);
    return api<Page>('/page/' + title, { token });
}

export const savePage = async (pageTemp : Page, token : string): Promise<string> => {
    log("Saving page: " + pageTemp.title);
    return api<string>('/page/' + pageTemp.title, {
        method: 'PUT',
        token,
        contentType: 'text/plain',
        body: JSON.stringify({
            content: pageTemp.content,
            categories: pageTemp.categories,
        }),
    });
}

export const deletePage = async (page : Page, token : string): Promise<string> => {
    log("Deleting page: " + page.title);
    return api<string>('/page/' + page.title, {
        method: 'DELETE',
        token,
        contentType: 'text/plain',
    });
}

export const blockPage = async (page : Page, readBlock : string, writeBlock : string, token : string): Promise<string> => {
    log("Blocking page: " + page.title);
    return api<string>('/page/block/' + page.title + '?readBlock=' + readBlock + "&writeBlock=" + writeBlock, {
        method: 'POST',
        token,
        contentType: 'text/plain',
    });
}