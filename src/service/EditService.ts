import {Edit} from "../model/page/Edit.ts";
import {api, log} from "./Common.ts";

export const fetchEdit = async (edit: string): Promise<Edit> => {
    log("Fetching edit: " + edit);
    return api<Edit>('/page/-edit/' + encodeURIComponent(edit));
}

export const fetchEdits = async (username : string, page : number, pageSize : number) : Promise<Edit[]> => {
    log("Fetching edits: ");
    const query = new URLSearchParams({page: String(page), pageSize: String(pageSize)}).toString();
    return api<Edit[]>('/page/-contributions/' + encodeURIComponent(username) + "?" + query);
}

export const fetchRecentChanges = async (page : number, pageSize : number) : Promise<Edit[]> => {
    log("Fetching recent changes: ");
    return api<Edit[]>('/page/recentChanges', {
        method: 'POST',
        contentType: 'application/json',
        body: JSON.stringify({page, pageSize}),
    });
}

export const fetchPageEdits = async (title : string, page : number, pageSize : number) : Promise<Edit[]> => {
    log("Fetching page edits: " + title);
    const query = new URLSearchParams({page: String(page), pageSize: String(pageSize)}).toString();
    return api<Edit[]>('/page/-edits/' + encodeURIComponent(title) + "?" + query);
}