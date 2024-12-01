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
import {blockPage, deletePage, fetchPage, savePage} from "../service/PageService.ts";
import BlockIcon from '@mui/icons-material/Block';
import BlockComponent from "../components/BlockComponent.tsx";

export default function PageComponent(): ReactNode | null {

    const loggedUser = useAppSelector((state) => state.loggedUser);
    const config = useAppSelector((state) => state.config);
    const dispatch = useDispatch();
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
            dispatch(showError());
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
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [blockOpen, setBlockOpen] = useState<boolean>(false);

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
        setIsAdmin(UserLevel[loggedUser.user.level].toString() == UserLevel.ADMIN.toString());
        setBlocks();
    }, [loggedUser, page]);

    const setBlocks = (): void => {
        let blockLevel = UserLevel[config.value['EDIT_LEVEL'] as keyof typeof UserLevel]?.valueOf();
        if (page.block) {
            blockLevel = Math.max(blockLevel, page.block);
        }
        const deleteLevel = UserLevel[config.value['DELETE_LEVEL'] as keyof typeof UserLevel]?.valueOf();
        setCanEdit(parseInt(UserLevel[loggedUser.user.level]) >= blockLevel);
        setCanDelete(parseInt(UserLevel[loggedUser.user.level]) >= deleteLevel);
    }

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
                dispatch(showError());
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
                        <Typography><Fab color="info" aria-label={t("Edits")} onClick={editsEvent}>
                            <EditNoteIcon/>
                        </Fab></Typography>
                    </Tooltip>
                    <Tooltip title={t("Block")} placement="left">
                        <Typography><Fab color="warning" aria-label={t("Block")} onClick={blockEvent} disabled={!isAdmin}>
                            <BlockIcon/>
                        </Fab></Typography>
                    </Tooltip>
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


