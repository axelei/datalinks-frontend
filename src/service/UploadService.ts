import {Upload} from "../model/upload/Upload.ts";
import {log} from "./Common.ts";

export const saveUpload = async (upload : Upload, loginToken : string): Promise<object> => {
    log("Saving upload: " + upload.filename);
    const requestOptions = {
        method: 'PUT',
        headers: {
            'Content-Type': 'text/plain',
            'Authorization': 'Bearer ' + loginToken,
        },
        body: JSON.stringify({
            filename: upload.filename,
            description: upload.description,
        }),
    };
    return await fetch(import.meta.env.VITE_API + '/file/update', requestOptions);
}

export const fetchUpload = async (fileName: string): Promise<Upload> => {
    log("Fetching upload: " + fileName);
    const data = await fetch(import.meta.env.VITE_API + '/file/lookAt/' + fileName);
    if (data.ok) {
        return data.json();
    } else {
        return Promise.reject(data.status);
    }
}