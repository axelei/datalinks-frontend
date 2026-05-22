import {Edit} from "../model/page/Edit.ts";
import {api, log} from "./Common.ts";

export const fetchEdit = async (edit: string): Promise<Edit> => {
    log("Fetching edit: " + edit);
    return api<Edit>('/page/-edit/' + edit);
}

export const fetchEdits = async (username : string, page : number, pageSize : number) : Promise<Edit[]> => {
    log("Fetching edits: ");
    return api<Edit[]>('/page/-contributions/' + username + "?page=" + page + "&pageSize=" + pageSize);
}