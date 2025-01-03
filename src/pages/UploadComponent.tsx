import {ChangeEvent, ReactNode, useEffect, useState} from 'react';
import {PageMode} from "../model/page/PageMode.ts";
import {Link, useLocation, useNavigate} from "react-router-dom";
import '../css/PageComponent.css';
import {useDispatch} from "react-redux";
import {loadingOff, loadingOn} from "../redux/loadingSlice.ts";
import {useAppSelector} from "../hooks.ts";
import {useTranslation} from "react-i18next";
import Typography from "@mui/material/Typography";
import {log} from "../service/Common.ts";
import {UserLevel} from "../model/user/UserLevel.ts";
import {newUpload, Upload} from "../model/upload/Upload.ts";
import {TextareaAutosize} from "@mui/material";
import {Page} from "../model/page/Page.ts";
import EditButtons from "../components/EditButtons.tsx";
import {fetchUpload, saveUpload} from "../service/UploadService.ts";
import {showError} from "../redux/showErrorSlice.ts";

export default function UploadComponent(): ReactNode | null {

    const {t} = useTranslation();
    const loggedUser = useAppSelector((state) => state.loggedUser);
    const config = useAppSelector((state) => state.config);
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    const fetchUsage = async (fileName: string): Promise<Page[]> => {
        log("Fetching usages: " + fileName);
        const data = await fetch(import.meta.env.VITE_API + '/file/usages/' + fileName);
        if (data.ok) {
            return data.json();
        } else {
            return Promise.reject(data.status);
        }
    }

    const deleteUpload = async (fileName: string): Promise<string> => {
        log("Deleting upload: " + fileName);
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'text/plain',
                'Authorization': 'Bearer ' + loggedUser.token,
            },
        };
        const data = await fetch(import.meta.env.VITE_API + '/file/delete/' + fileName, requestOptions);
        if (data.ok) {
            return data.text();
        } else {
            return Promise.reject(data.status);
        }
    }

    const editUploadEvent = (): void => {
        setMode(PageMode.edit);
        setUploadTemp({...upload});
    }

    const saveUploadEvent = (): void => {
        dispatch(loadingOn());
        const saveResult = saveUpload(uploadTemp, loggedUser.token);
        saveResult.then(() => {
            setMode(PageMode.read);
            setUpload({...uploadTemp});
        }).catch((error) => {
            log("Error while saving upload: " + error);
            dispatch(showError());
        }).finally(() => {
            dispatch(loadingOff());
        });
    }

    const deleteUploadEvent = (): void => {
        dispatch(loadingOn());
        const deleteResult = deleteUpload(upload.filename);
        deleteResult.then((_data) => {
            navigate('/');
        }).catch((error) => {
            log("Error while deleting upload: " + error);
            dispatch(showError());
        }).finally(() => {
            dispatch(loadingOff());
        });
    }

    const changeContentEvent = (event: ChangeEvent<HTMLTextAreaElement>): void => {
        setUploadTemp({...uploadTemp, description: event.target.value});
    }

    const cancelEditionEvent = (): void => {
        setMode(PageMode.read);
        setUploadTemp({...upload});
    }

    const [mode, setMode] = useState(PageMode.read);
    const [upload, setUpload] = useState<Upload>(newUpload(''));
    const [uploadTemp, setUploadTemp] = useState<Upload>(newUpload(''));
    const [canEdit, setCanEdit] = useState<boolean>(false);
    const [canDelete, setCanDelete] = useState<boolean>(false);
    const [usages, setUsages] = useState<Page[]>([]);

    useEffect(() => {
        log("UploadComponent upload useEffect");
        let filename = location.pathname.split('/')[2];
        if (!filename) {
            filename = import.meta.env.VITE_SITE_INDEX;
        }
        log("Current title: " + filename);

        document.title = import.meta.env.VITE_SITE_TITLE + ' - ' + decodeURIComponent(filename);

        const apiResponse = fetchUpload(filename);
        apiResponse.then(data => {
            setUpload({...data});
            setUploadTemp({...data});
            setMode(PageMode.read);
            setBlocks();

            const usageResponse = fetchUsage(filename);
            usageResponse.then(data => {
                setUsages(data);
            }).catch((error: Promise<string>) => {
                log("Usages fetch failed: " + error);
            });

            window.scroll(0, 0);
        }).catch((error: Promise<string>) => {
            const blockLevel = UserLevel[config.value['CREATE_LEVEL'] as keyof typeof UserLevel]?.valueOf();
            setCanEdit(parseInt(UserLevel[loggedUser.user.level]) >= blockLevel);
            setUpload(newUpload(decodeURIComponent(filename)));
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
        const deleteLevel = UserLevel[config.value['DELETE_LEVEL'] as keyof typeof UserLevel]?.valueOf();
        setCanDelete(parseInt(UserLevel[loggedUser.user.level]) >= deleteLevel);
    }


    return (
        <>
            <EditButtons editPageEvent={editUploadEvent} savePageEvent={saveUploadEvent} cancelEditionEvent={cancelEditionEvent} canEdit={canEdit} mode={mode}  canDelete={canDelete} handleConfirmDelete={deleteUploadEvent}/>
            <Typography variant="h2">{upload.filename}</Typography>
            <p>
            <a href={import.meta.env.VITE_API + '/file/get/' + upload.slug} target="_blank"><img
                src={import.meta.env.VITE_API + '/file/get/' + upload.slug}
                alt={upload.filename}
                className="uploadImage" /></a>
            </p>
            {mode === PageMode.read && (
                <>
                    <article>{upload.description}</article>
                </>
            )}
            {mode === PageMode.edit && (
                <>
                    <TextareaAutosize defaultValue={uploadTemp.description} minRows={5} onChange={changeContentEvent}></TextareaAutosize>
                </>
            )}
            <Typography variant="h3">{t("Usages")}</Typography>
            <ul>
                {usages.map((item) => (
                    <li key={item.title}>
                        <Link to={'/page/' + item.title}>{item.title}</Link>
                    </li>
                ))}
            </ul>
        </>
    )
}


