import {Upload} from "../model/upload/Upload.ts";
import {Page} from "../model/page/Page.ts";
import {api, log} from "./Common.ts";

export const saveUpload = async (upload : Upload, loginToken : string): Promise<object> => {
    log("Saving upload: " + upload.filename);
    return api('/file/update', {
        method: 'PUT',
        token: loginToken,
        contentType: 'application/json',
        body: JSON.stringify({
            filename: upload.filename,
            description: upload.description,
        }),
    });
}

export const fetchUpload = async (fileName: string): Promise<Upload> => {
    log("Fetching upload: " + fileName);
    return api<Upload>('/file/lookAt/' + encodeURIComponent(fileName));
}

export const fetchNewUploads = async (page: number, pageSize: number): Promise<Upload[]> => {
    log("Fetching new uploads: ");
    return api<Upload[]>('/file/newUploads', {
        method: 'POST',
        contentType: 'application/json',
        body: JSON.stringify({page, pageSize}),
    });
}

export const fetchUploadUsages = async (fileName: string): Promise<Page[]> => {
    log("Fetching upload usages: " + fileName);
    return api<Page[]>('/file/usages/' + encodeURIComponent(fileName));
}

export const deleteUpload = async (fileName: string, token: string): Promise<string> => {
    log("Deleting upload: " + fileName);
    return api<string>('/file/delete/' + encodeURIComponent(fileName), {
        method: 'DELETE',
        token,
        contentType: 'text/plain',
    });
}