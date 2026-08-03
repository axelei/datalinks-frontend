import {ChangeEvent, ReactNode, useCallback, useEffect, useState} from 'react';
import {PageMode} from "../model/page/PageMode.ts";
import {Link, useLocation, useNavigate} from "react-router-dom";
import '../css/PageComponent.css';
import {loadingOff, loadingOn} from "../redux/loadingSlice.ts";
import {useAppDispatch, useAppSelector} from "../hooks.ts";
import {useTranslation} from "react-i18next";
import Typography from "@mui/material/Typography";
import {getErrorMessage, log} from "../service/Common.ts";
import {hasLevel, levelValue} from "../model/user/UserLevel.ts";
import {newUpload, Upload} from "../model/upload/Upload.ts";
import {TextareaAutosize} from "@mui/material";
import {Page} from "../model/page/Page.ts";
import EditButtons from "../components/EditButtons.tsx";
import {deleteUpload, fetchUpload, fetchUploadUsages, saveUpload} from "../service/UploadService.ts";
import {showError} from "../redux/showErrorSlice.ts";

export default function UploadComponent(): ReactNode | null {

    const {t} = useTranslation();
    const loggedUser = useAppSelector((state) => state.loggedUser);
    const config = useAppSelector((state) => state.config);
    const dispatch = useAppDispatch();
    const location = useLocation();
    const navigate = useNavigate();

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
            dispatch(showError(getErrorMessage(t, error)));
        }).finally(() => {
            dispatch(loadingOff());
        });
    }

    const deleteUploadEvent = (): void => {
        dispatch(loadingOn());
        const deleteResult = deleteUpload(upload.filename, loggedUser.token);
        deleteResult.then(() => {
            navigate('/');
        }).catch((error) => {
            log("Error while deleting upload: " + error);
            dispatch(showError(getErrorMessage(t, error)));
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

    const setBlocks = useCallback((): void => {
        let blockLevel = levelValue(config.value['EDIT_LEVEL']);
        if (upload.editBlock) {
            blockLevel = Math.max(blockLevel, levelValue(upload.editBlock));
        }
        setCanEdit(hasLevel(loggedUser.user.level, blockLevel));
        const deleteLevel = levelValue(config.value['DELETE_LEVEL']);
        setCanDelete(hasLevel(loggedUser.user.level, deleteLevel));
    }, [config, loggedUser, upload.editBlock]);

    useEffect(() => {
        log("UploadComponent upload useEffect");
        let filename = decodeURIComponent(location.pathname.split('/')[2] ?? '');
        if (!filename) {
            filename = import.meta.env.VITE_SITE_INDEX;
        }
        log("Current title: " + filename);

        document.title = import.meta.env.VITE_SITE_TITLE + ' - ' + filename;

        const apiResponse = fetchUpload(filename);
        apiResponse.then(data => {
            setUpload({...data});
            setUploadTemp({...data});
            setMode(PageMode.read);
            setBlocks();

            fetchUploadUsages(filename).then(data => {
                setUsages(data);
            }).catch((error: Promise<string>) => {
                log("Usages fetch failed: " + error);
            });

            window.scroll(0, 0);
        }).catch((error: Promise<string>) => {
            const blockLevel = levelValue(config.value['CREATE_LEVEL']);
            setCanEdit(hasLevel(loggedUser.user.level, blockLevel));
            setUpload(newUpload(filename));
            log("Page fetch failed: " + error);
        });

    }, [location.pathname, config, loggedUser, setBlocks]);

    useEffect(() => {
        log("UploadComponent user useeffect");
        setBlocks();
    }, [setBlocks]);


    return (
        <>
            <EditButtons editPageEvent={editUploadEvent} savePageEvent={saveUploadEvent} cancelEditionEvent={cancelEditionEvent} canEdit={canEdit} mode={mode}  canDelete={canDelete} handleConfirmDelete={deleteUploadEvent}/>
            <Typography variant="h2">{upload.filename}</Typography>
            <p>
            <a href={import.meta.env.VITE_API + '/file/get/' + upload.slug} target="_blank" rel="noopener noreferrer"><img
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
                        <Link to={'/page/' + encodeURIComponent(item.title)}>{item.title}</Link>
                    </li>
                ))}
            </ul>
        </>
    )
}
