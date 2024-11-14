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