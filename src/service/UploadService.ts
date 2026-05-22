import {Upload} from "../model/upload/Upload.ts";
import {api, log} from "./Common.ts";

export const saveUpload = async (upload : Upload, loginToken : string): Promise<object> => {
    log("Saving upload: " + upload.filename);
    return api('/file/update', {
        method: 'PUT',
        token: loginToken,
        contentType: 'text/plain',
        body: JSON.stringify({
            filename: upload.filename,
            description: upload.description,
        }),
    });
}

export const fetchUpload = async (fileName: string): Promise<Upload> => {
    log("Fetching upload: " + fileName);
    return api<Upload>('/file/lookAt/' + fileName);
}