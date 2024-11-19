import {ReactNode, useEffect, useState} from 'react';
import {PageMode} from "../model/page/PageMode.ts";
import {useLocation, useNavigate} from "react-router-dom";
import {newPage, Page} from "../model/page/Page.ts";
import '../css/PageComponent.css';
import {useDispatch} from "react-redux";
import {loadingOff, loadingOn} from "../redux/loadingSlice.ts";
import {useAppSelector} from "../hooks.ts";
import Typography from "@mui/material/Typography";
import {log} from "../service/Common.ts";
import {UserLevel} from "../model/user/UserLevel.ts";
import PageContentComponent from "../components/PageContentComponent.tsx";
import EditorComponent from "../components/EditorComponent.tsx";
import {ClassicEditor, EventInfo} from "ckeditor5";
import EditButtons from "../components/EditButtons.tsx";
import {Fab, Tooltip} from "@mui/material";
import {t} from "i18next";
import EditNoteIcon from '@mui/icons-material/EditNote';
import {showError} from "../redux/showErrorSlice.ts";
import {Category} from "../model/page/Category.ts";

export default function PageComponent(): ReactNode | null {

    const loggedUser = useAppSelector((state) => state.loggedUser);
    const config = useAppSelector((state) => state.config);
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    const fetchPage = async (title: string): Promise<Page> => {
        log("Fetching page: " + title);
        const data = await fetch(import.meta.env.VITE_API + '/page/' + title);
        if (data.ok) {
            return data.json();
        } else {
            return Promise.reject(data.status);
        }
    }

    const savePage = async (): Promise<object> => {
        log("Saving page: " + pageTemp.title);
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'text/plain',
                'Authorization': 'Bearer ' + loggedUser.token,
            },
            body: JSON.stringify({
                content: pageTemp.content,
                categories: pageTemp.categories,
            }),
        };
        return await fetch(import.meta.env.VITE_API + '/page/' + pageTemp.title, requestOptions);
    }

    const deletePage = async (): Promise<object> => {
        log("Deleting page: " + page.title);
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'text/plain',
                'Authorization': 'Bearer ' + loggedUser.token,
            },
        };
        return await fetch(import.meta.env.VITE_API + '/page/' + page.title, requestOptions);
    }

    const editPageEvent = (): void => {
        setMode(PageMode.edit);
        setPageTemp({...page});
    }

    const savePageEvent = (): void => {
        dispatch(loadingOn());
        const saveResult = savePage();
        saveResult.then(() => {
            setMode(PageMode.read);
            setPage({...pageTemp});
        }).catch((error) => {
            log("Error while saving page: " + error);
            dispatch(showError());
        }).finally(() => {
            dispatch(loadingOff());
        });
    }

    const deletePageEvent = (): void => {
        dispatch(loadingOn());
        const deleteResult = deletePage();
        deleteResult.then(() => {
            navigate('/');
        }).catch((error) => {
            log("Error while deleting page: " + error);
            dispatch(showError());
        }).finally(() => {
            dispatch(loadingOff());
        });
    }

    const changeContentEvent = (_event: EventInfo<string, unknown>, editor: ClassicEditor): void => {
        setPageTemp({...pageTemp, content: editor.getData()});
    }

    const cancelEditionEvent = (): void => {
        setMode(PageMode.read);
        setPageTemp({...page});
    }

    const editsEvent = (): void => {
        navigate('/edits/' + page.title);
    }

    const setCategories = (categories: Category[]) => {
        setPageTemp({...pageTemp, categories: categories});
    }

    const [mode, setMode] = useState(PageMode.read);
    const [page, setPage] = useState<Page>(newPage(''));
    const [pageTemp, setPageTemp] = useState<Page>(newPage(''));
    const [canEdit, setCanEdit] = useState<boolean>(false);
    const [canDelete, setCanDelete] = useState<boolean>(false);

    useEffect(() => {
        log("PageComponent page useEffect");
        let currentTitle = location.pathname.split('/')[2];
        if (!currentTitle) {
            currentTitle = import.meta.env.VITE_SITE_INDEX;
        }
        log("Current title: " + currentTitle);

        document.title = import.meta.env.VITE_SITE_TITLE + ' - ' + decodeURIComponent(currentTitle);

        const apiResponse = fetchPage(currentTitle);
        apiResponse.then(data => {
            setPage({...data});
            setPageTemp({...data});
            setMode(PageMode.read);
            setBlocks();
            window.scroll(0, 0);
        }).catch((error: string) => {
            if (error == "404") {
                const blockLevel = UserLevel[config.value['CREATE_LEVEL'] as keyof typeof UserLevel]?.valueOf();
                setCanEdit(parseInt(UserLevel[loggedUser.user.level]) >= blockLevel);
                setPage(newPage(decodeURIComponent(currentTitle)));
            } else {
                dispatch(showError());
            }
        });

    }, [location.pathname]);

    useEffect(() => {
        log("PageComponent user useeffect");
        setBlocks();
    }, [config.value, loggedUser.user.level, page.block]);

    const setBlocks = (): void => {
        let blockLevel = UserLevel[config.value['EDIT_LEVEL'] as keyof typeof UserLevel]?.valueOf();
        if (page.block) {
            blockLevel = Math.max(blockLevel, page.block);
        }
        const deleteLevel = UserLevel[config.value['DELETE_LEVEL'] as keyof typeof UserLevel]?.valueOf();
        setCanEdit(parseInt(UserLevel[loggedUser.user.level]) >= blockLevel);
        setCanDelete(parseInt(UserLevel[loggedUser.user.level]) >= deleteLevel);
    }

    return (
        <>
            <EditButtons editPageEvent={editPageEvent} savePageEvent={savePageEvent} cancelEditionEvent={cancelEditionEvent} canEdit={canEdit} mode={mode}  canDelete={canDelete} handleConfirmDelete={deletePageEvent}>
                {mode === PageMode.read && (
                <Tooltip title={t("Edits")} placement="left">
                    <Typography><Fab color="info" aria-label={t("Edits")} onClick={editsEvent}>
                        <EditNoteIcon/>
                    </Fab></Typography>
                </Tooltip>
                )}
            </EditButtons>
            <Typography variant="h2">{page.title}</Typography>
            {mode === PageMode.read && (
                <>
                    <PageContentComponent page={page}/>
                </>
            )}
            {mode === PageMode.edit && (
                <>
                    <EditorComponent initialContent={pageTemp.content} changeContentEvent={changeContentEvent} initialCategories={page.categories} setCategories={setCategories} />
                </>
            )}
        </>
    )
}


