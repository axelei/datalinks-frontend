import {api} from "./Common.ts";
import {Configlet} from "../model/page/Configlet.ts";

export const fetchConfig = async () : Promise<Configlet[]> => {
    return api<Configlet[]>('/config/all');
}
