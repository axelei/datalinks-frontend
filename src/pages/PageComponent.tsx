import {ReactNode, useEffect, useState} from 'react';
import {PageMode} from "../model/page/PageMode.ts";
import {useLocation} from "react-router-dom";
import {newPage, Page} from "../model/page/Page.ts";
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
import PageContentComponent from "../components/PageContentComponent.tsx";
import EditorComponent from "../components/EditorComponent.tsx";
import {ClassicEditor, EventInfo} from "ckeditor5";

export default function PageComponent() : ReactNode | null {

    const { t } = useTranslation();
    const loggedUser = useAppSelector((state) => state.loggedUser);
    const config = useAppSelector((state) => state.config);
    const dispatch = useDispatch();
    const location = useLocation();

    const fetchPage = async (title : string) : Promise<Page> => {
        log("Fetching page: " + title);
        const data = await fetch(import.meta.env.VITE_API + '/page/' + title);
        if (data.ok) {
            return data.json();
        } else {
            return Promise.reject(data.text());
        }
    }

    const savePage = async () : Promise<object> => {
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

    const editPageEvent = () : void => {
        setMode(PageMode.edit);
        setPageTemp({...page});
    }

    const savePageEvent = () : void => {
        dispatch(loadingOn());
        const saveResult = savePage();
        saveResult.then(() => {
            setMode(PageMode.read);
            setPage({...pageTemp});
        }).finally(() => {
                dispatch(loadingOff());
        });
    }

    const changeContentEvent = (_event : EventInfo<string, unknown>, editor : ClassicEditor) : void => {
        setPageTemp({...pageTemp, content: editor.getData()});
    }

    const cancelEditionEvent = () : void => {
        setMode(PageMode.read);
        setPageTemp(newPage(page.title));
    }

    const [mode, setMode] = useState(PageMode.read);
    const [page, setPage] = useState<Page>(newPage(''));
    const [pageTemp, setPageTemp] = useState<Page>(newPage(''));
    const [canEdit, setCanEdit] = useState<boolean>(false);

    useEffect(() => {
        log("PageComponent useEffect");
        let currentTitle = location.pathname.split('/')[2];
        if (!currentTitle) {
            currentTitle = import.meta.env.VITE_SITE_INDEX;
        }
        log("Current title: " + currentTitle);

        document.title = import.meta.env.VITE_SITE_TITLE + ' - ' + currentTitle;

        const apiResponse = fetchPage(currentTitle);
        apiResponse.then(data => {
            setPage({...data});

            let blockLevel = UserLevel[config.value['EDIT_LEVEL'] as keyof typeof UserLevel]?.valueOf();
            if (page.block) {
                blockLevel = Math.max(blockLevel, page.block);
            }
            setCanEdit(parseInt(UserLevel[loggedUser.user.level]) >= blockLevel);

        }).catch((error : Promise<string>) => {

            const blockLevel = UserLevel[config.value['CREATE_LEVEL'] as keyof typeof UserLevel]?.valueOf();
            setCanEdit(parseInt(UserLevel[loggedUser.user.level]) >= blockLevel);

            setPage(newPage(currentTitle));

            log("Page fetch failed: " + error);

        });

    }, [config.value, location, loggedUser.user.level, page.block]);


    return (
        <>
            <Typography variant="h2">{page.title}</Typography>
            {mode === PageMode.read && (
                <>
                    <PageContentComponent content={page.content}/>
                    <Button variant="contained" onClick={editPageEvent} disabled={!canEdit}><EditIcon /> {t("Edit")}</Button>
                </>
            )}
            {mode === PageMode.edit && (
                <>
                    <EditorComponent initialContent={pageTemp.content} changeContentEvent={changeContentEvent} />
                    <Button variant="contained" onClick={savePageEvent}>{t("Save")}</Button>
                    <Button variant="contained" onClick={cancelEditionEvent}>{t("Cancel")}</Button>
                </>
            )}
            <ul>
            {page.categories.map((category) => (
                <li key={'category-' + category.name}>
                    {category.name} -
                </li>
            ))}
            </ul>
        </>
    )
}


