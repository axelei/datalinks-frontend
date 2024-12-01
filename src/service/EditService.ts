import {Edit} from "../model/page/Edit.ts";
import {log} from "./Common.ts";

export const fetchEdit = async (edit: string): Promise<Edit> => {
    log("Fetching edit: " + edit);
    const data = await fetch(import.meta.env.VITE_API + '/page/-edit/' + edit);
    if (data.ok) {
        return data.json();
    } else {
        return Promise.reject(data.text());
    }
}

export const fetchEdits = async (username : string, page : number, pageSize : number) : Promise<Edit[]> => {
    log("Fetching edits: ");
    const data = await fetch(import.meta.env.VITE_API + '/page/-contributions/' + username + "?page=" + page + "&pageSize=" + pageSize);
    if (data.ok) {
        return data.json();
    } else {
        return Promise.reject(data.text());
    }
}