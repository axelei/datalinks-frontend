import {ReactNode, useCallback, useEffect, useRef, useState} from 'react';
import {PageMode} from "../model/page/PageMode.ts";
import {useLocation, useNavigate} from "react-router-dom";
import {newPage, Page} from "../model/page/Page.ts";
import '../css/PageComponent.css';
import {loadingOff, loadingOn} from "../redux/loadingSlice.ts";
import {useAppDispatch, useAppSelector} from "../hooks.ts";
import Typography from "@mui/material/Typography";
import {getErrorMessage, log} from "../service/Common.ts";
import {hasLevel, isLevel, levelValue, UserLevel} from "../model/user/UserLevel.ts";
import PageContentComponent from "../components/PageContentComponent.tsx";
import EditorComponent from "../components/EditorComponent.tsx";
import {ClassicEditor, EventInfo} from "ckeditor5";
import EditButtons from "../components/EditButtons.tsx";
import CreatePageFloatingButton from "../components/CreatePageFloatingButton.tsx";
import {Fab, Tooltip} from "@mui/material";
import {t} from "i18next";
import EditNoteIcon from '@mui/icons-material/EditNote';
import {showError} from "../redux/showErrorSlice.ts";
import {Category} from "../model/page/Category.ts";
import {blockPage, deletePage, fetchPage, savePage} from "../service/PageService.ts";
import BlockIcon from '@mui/icons-material/Block';
import BlockComponent from "../components/BlockComponent.tsx";

export default function PageComponent(): ReactNode | null {

    const loggedUser = useAppSelector((state) => state.loggedUser);
    const config = useAppSelector((state) => state.config);
    const dispatch = useAppDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    const editPageEvent = (): void => {
        setMode(PageMode.edit);
        setPageTemp({...page});
    }

    const savePageEvent = (): void => {
        dispatch(loadingOn());
        const saveResult = savePage(pageTemp, loggedUser.token);
        saveResult.then(() => {
            setMode(PageMode.read);
            setPage({...pageTemp});
        }).catch((error) => {
            log("Error while saving page: " + error);
            dispatch(showError(getErrorMessage(t, error)));
        }).finally(() => {
            dispatch(loadingOff());
        });
    }

    const deletePageEvent = (): void => {
        dispatch(loadingOn());
        const deleteResult = deletePage(page, loggedUser.token);
        deleteResult.then(() => {
            navigate('/');
        }).catch((error) => {
            log("Error while deleting page: " + error);
            dispatch(showError(getErrorMessage(t, error)));
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
        navigate('/edits/' + encodeURIComponent(page.title));
    }

    const blockEvent = () : void => {
        setBlockOpen(true);
    }

    const setCategories = (categories: Category[]) => {
        setPageTemp({...pageTemp, categories: categories});
    }

    const [mode, setMode] = useState(PageMode.read);
    const [page, setPage] = useState<Page>(newPage(''));
    const [pageTemp, setPageTemp] = useState<Page>(newPage(''));
    const [canEdit, setCanEdit] = useState<boolean>(false);
    const [canDelete, setCanDelete] = useState<boolean>(false);
    const [canCreate, setCanCreate] = useState<boolean>(false);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [blockOpen, setBlockOpen] = useState<boolean>(false);
    const consumedEditMode = useRef(false);

    const setBlocks = useCallback((): void => {
        let blockLevel = levelValue(config.value['EDIT_LEVEL']);
        if (page.editBlock) {
            blockLevel = Math.max(blockLevel, levelValue(page.editBlock));
        }
        const deleteLevel = levelValue(config.value['DELETE_LEVEL']);
        setCanEdit(hasLevel(loggedUser.user.level, blockLevel));
        setCanDelete(hasLevel(loggedUser.user.level, deleteLevel));
        const createLevel = levelValue(config.value['CREATE_LEVEL']);
        setCanCreate(hasLevel(loggedUser.user.level, createLevel));
    }, [config, loggedUser, page]);

    useEffect(() => {
        log("PageComponent page useEffect");
        const state = location.state as { openInEditMode?: boolean } | null;

        let currentTitle = decodeURIComponent(location.pathname.split('/')[2] ?? '');
        if (!currentTitle) {
            currentTitle = import.meta.env.VITE_SITE_INDEX;
        }
        log("Current title: " + currentTitle);

        document.title = import.meta.env.VITE_SITE_TITLE + ' - ' + currentTitle;

        const apiResponse = fetchPage(currentTitle, loggedUser.token);
        apiResponse.then(data => {
            setPage({...data});
            setPageTemp({...data});
            setMode(PageMode.read);
            if (state?.openInEditMode && !consumedEditMode.current) {
                consumedEditMode.current = true;
                setMode(PageMode.edit);
            }
            window.scroll(0, 0);
        }).catch((error: string) => {
            if (error == "404") {
                const blockLevel = levelValue(config.value['CREATE_LEVEL']);
                const userCanEdit = hasLevel(loggedUser.user.level, blockLevel);
                setCanEdit(userCanEdit);
                const newPg = newPage(currentTitle);
                setPage(newPg);
                if (state?.openInEditMode && userCanEdit && !consumedEditMode.current) {
                    consumedEditMode.current = true;
                    setPageTemp({...newPg});
                    setMode(PageMode.edit);
                }
            } else if (error == "403") {
                setCanEdit(false);
            } else {
                dispatch(showError(getErrorMessage(t, error)));
            }
        });

    }, [location.pathname, location.state, loggedUser, config, dispatch]);

    useEffect(() => {
        log("PageComponent user useeffect");
        setIsAdmin(isLevel(loggedUser.user.level, UserLevel.ADMIN));
        setBlocks();
    }, [loggedUser, page, setBlocks]);

    const handleBlockClose = () => {
        setBlockOpen(false);
    }

    const handleBlockAccept = (readLevel : string, writeLevel : string) => {
        dispatch(loadingOn());
        blockPage(page, readLevel, writeLevel, loggedUser.token)
            .then(() => {
                setBlockOpen(false);
            }).catch((error) => {
                log("Error while blocking page: " + error);
                dispatch(showError(getErrorMessage(t, error)));
            }).finally(() => {
                dispatch(loadingOff());
            });
    }


    return (
        <>
            <EditButtons editPageEvent={editPageEvent}
                         savePageEvent={savePageEvent}
                         cancelEditionEvent={cancelEditionEvent}
                         canEdit={canEdit}
                         mode={mode}
                         canDelete={canDelete}
                         handleConfirmDelete={deletePageEvent}>
                {mode === PageMode.read && (
                    <>
                    <Tooltip title={t("Edits")} placement="left">
                        <Typography><Fab color="info" aria-label={t("Edits")} onClick={editsEvent} disabled={!page.slug}>
                            <EditNoteIcon/>
                        </Fab></Typography>
                    </Tooltip>
                    <Tooltip title={t("Block")} placement="left">
                        <Typography><Fab color="warning" aria-label={t("Block")} onClick={blockEvent} disabled={!isAdmin}>
                            <BlockIcon/>
                        </Fab></Typography>
                    </Tooltip>
                    {canCreate && <CreatePageFloatingButton />}
                    </>
                )}
            </EditButtons>
            <Typography variant="h2">{page.title}</Typography>
            {mode === PageMode.read && (
                <>
                    <BlockComponent open={blockOpen} onClose={handleBlockClose} handleAccept={handleBlockAccept} page={page} />
                    <PageContentComponent page={page}/>
                </>
            )}
            {mode === PageMode.edit && (
                <>
                    <EditorComponent initialContent={pageTemp.content}
                                     changeContentEvent={changeContentEvent}
                                     initialCategories={page.categories}
                                     setCategories={setCategories} />
                </>
            )}
        </>
    )
}


