import {UserLevel} from "../user/UserLevel.ts";

export interface Upload {
    filename: string;
    slug: string;
    description?: string;
    creationDate?: Date;
    modifiedDate?: Date;
    editBlock?: UserLevel;
    createBlock?: UserLevel;
}

export const newUpload = (filename = '') : Upload => {
    return {
        filename: filename,
        slug: ""
    };
}