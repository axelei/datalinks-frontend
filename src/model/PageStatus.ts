import {PageMode} from "./PageMode.ts";
import {PageObject} from "./PageObject.ts";

export interface PageStatus {
    mode: PageMode;
    page: PageObject;
}