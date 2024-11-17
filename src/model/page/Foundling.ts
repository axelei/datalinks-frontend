import {FoundlingType} from "./FoundlingType.ts";

export interface Foundling {
    title: string;
    content: string;
    type: FoundlingType;
}