import {ReactNode, useEffect, useState} from 'react';
import {PageMode} from "../model/page/PageMode.ts";
import {useLocation} from "react-router-dom";
import Button from '@mui/material/Button';
import '../css/PageComponent.css';
import {useDispatch} from "react-redux";
import {loadingOff, loadingOn} from "../redux/loadingSlice.ts";
import {useAppSelector} from "../hooks.ts";
import {useTranslation} from "react-i18next";
import Typography from "@mui/material/Typography";
import {log} from "../service/Common.ts";
import {UserLevel} from "../model/user/UserLevel.ts";
import EditIcon from '@mui/icons-material/Edit';
import {ClassicEditor, EventInfo} from "ckeditor5";
import {newUpload, Upload} from "../model/upload/Upload.ts";

export default function UploadComponent(): ReactNode | null {

    const {t} = useTranslation();
    const loggedUser = useAppSelector((state) => state.loggedUser);
    const config = useAppSelector((state) => state.config);
    const dispatch = useDispatch();
    const location = useLocation();

    const fetchPage = async (fileName: string): Promise<Upload> => {
        log("Fetching upload: " + fileName);
        const data = await fetch(import.meta.env.VITE_API + '/file/lookAt/' + fileName);
        if (data.ok) {
            return data.json();
        } else {
            return Promise.reject(data.text());
        }
    }

    const saveUpload = async (): Promise<object> => {
        log("Saving upload: " + uploadTemp.filename);
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'text/plain',
                'Authorization': 'Bearer ' + loggedUser.token,
            },
            body: JSON.stringify({
                description: uploadTemp.description,
            }),
        };
        return await fetch(import.meta.env.VITE_API + '/file/' + uploadTemp.filename, requestOptions);
    }

    const editUploadEvent = (): void => {
        setMode(PageMode.edit);
        setUploadTemp({...upload});
    }

    const saveUploadEvent = (): void => {
        dispatch(loadingOn());
        const saveResult = saveUpload();
        saveResult.then(() => {
            setMode(PageMode.read);
            setUpload({...uploadTemp});
        }).finally(() => {
            dispatch(loadingOff());
        });
    }

    const changeContentEvent = (_event: EventInfo<string, unknown>, editor: ClassicEditor): void => {
        setUploadTemp({...uploadTemp, description: editor.getData()});
    }

    const cancelEditionEvent = (): void => {
        setMode(PageMode.read);
        setUploadTemp({...upload});
    }

    const [mode, setMode] = useState(PageMode.read);
    const [upload, setUpload] = useState<Upload>(newUpload(''));
    const [uploadTemp, setUploadTemp] = useState<Upload>(newUpload(''));
    const [canEdit, setCanEdit] = useState<boolean>(false);

    useEffect(() => {
        log("UploadComponent upload useEffect");
        let currentTitle = location.pathname.split('/')[2];
        if (!currentTitle) {
            currentTitle = import.meta.env.VITE_SITE_INDEX;
        }
        log("Current title: " + currentTitle);

        document.title = import.meta.env.VITE_SITE_TITLE + ' - ' + decodeURIComponent(currentTitle);

        const apiResponse = fetchPage(currentTitle);
        apiResponse.then(data => {
            setUpload({...data});
            setUploadTemp({...data});
            setMode(PageMode.read);
            setBlocks();
            window.scroll(0, 0);
        }).catch((error: Promise<string>) => {
            const blockLevel = UserLevel[config.value['CREATE_LEVEL'] as keyof typeof UserLevel]?.valueOf();
            setCanEdit(parseInt(UserLevel[loggedUser.user.level]) >= blockLevel);
            setUpload(newUpload(decodeURIComponent(currentTitle)));
            log("Page fetch failed: " + error);
        });

    }, [location.pathname]);

    useEffect(() => {
        log("UploadComponent user useeffect");
        setBlocks();
    }, [config.value, loggedUser.user.level, upload.editBlock]);

    const setBlocks = (): void => {
        let blockLevel = UserLevel[config.value['EDIT_LEVEL'] as keyof typeof UserLevel]?.valueOf();
        if (upload.editBlock) {
            blockLevel = Math.max(blockLevel, upload.editBlock);
        }
        setCanEdit(parseInt(UserLevel[loggedUser.user.level]) >= blockLevel);
    }


    return (
        <>
            <Typography variant="h2">{upload.filename}</Typography>
            <p>
            <img
                src={import.meta.env.VITE_API + '/file/get/' + upload.filename}
                alt={upload.filename}
                className="uploadImage" />
            </p>
            {mode === PageMode.read && (
                <>
                    <Typography variant="body1">{upload.description}</Typography>
                    <Button variant="contained" onClick={editUploadEvent} disabled={!canEdit}><EditIcon/> {t("Edit")}</Button>
                </>
            )}
            {mode === PageMode.edit && (
                <>
                    <Button variant="contained" onClick={saveUploadEvent}>{t("Save")}</Button>
                    <Button variant="contained" onClick={cancelEditionEvent}>{t("Cancel")}</Button>
                </>
            )}
        </>
    )
}


