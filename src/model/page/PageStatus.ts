import {PageMode} from "./PageMode.ts";
import {Page} from "./Page.ts";

export interface PageStatus {
    mode: PageMode;
    editingPage? : Page,
    page: Page;
}