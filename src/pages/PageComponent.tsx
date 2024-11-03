import {ChangeEvent, ReactNode, useEffect, useState} from 'react';
import {PageMode} from "../model/page/PageMode.ts";
import {useLocation} from "react-router-dom";
import {newPage, Page} from "../model/page/Page.ts";
import Button from '@mui/material/Button';
import {TextareaAutosize} from "@mui/material";
import '../css/PageComponent.css';
import {useDispatch} from "react-redux";
import {loadingOff, loadingOn} from "../redux/loadingSlice.ts";
import {Category} from "../model/page/Category.ts";
import {useAppSelector} from "../hooks.ts";
import {useTranslation} from "react-i18next";

export default function PageComponent() : ReactNode | null {

    const { t } = useTranslation();
    const loggedUser = useAppSelector((state) => state.loggedUser);

    const fetchPage = async (title : string) : Promise<Page> => {
        const data = await fetch(import.meta.env.VITE_API + '/page/' + title);
        if (data.ok) {
            return data.json();
        } else {
            return newPage(title);
        }
    }

    const savePage = async () : Promise<object> => {
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'text/plain',
                'login-token': loggedUser.token,
            },
            body: tempContent
        };
        return await fetch(import.meta.env.VITE_API + '/page/' + title, requestOptions);
    }

    const editPageEvent = () : void => {
        setMode(PageMode.edit);
        setTempContent(content);
    }

    const savePageEvent = () : void => {
        dispatch(loadingOn());
        const saveResult = savePage();
        saveResult.then(() => {
            setMode(PageMode.read);
            setContent(tempContent);
        }).finally(() => {
                dispatch(loadingOff());
            }
        );
    }

    const changeContentEvent = (ev: ChangeEvent<HTMLTextAreaElement>) : void => {
        setTempContent(ev.target.value);
    }

    const cancelEditionEvent = () : void => {
        setMode(PageMode.read);
        setTempContent('');
    }

    const [mode, setMode] = useState(PageMode.read);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tempContent, setTempContent] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);

    const dispatch = useDispatch();

    const location = useLocation();

    useEffect(() => {
        let currentTitle = location.pathname.split('/')[2];
        if (!currentTitle) {
            currentTitle = import.meta.env.VITE_SITE_INDEX;
        }

        const apiResponse = fetchPage(currentTitle);
        apiResponse.then(data => {
            setTitle(data.title);
            setContent(data.content);
            setCategories(data.categories);

            document.title = import.meta.env.VITE_SITE_TITLE + ' - ' + data.title;
        })

    }, [location.pathname]);


    return (
        <>
            <h1>{title}</h1>
            {mode === PageMode.read && (
                <>
                    <article>{content}</article>
                    <Button variant="contained" onClick={editPageEvent}>{t("Edit")}</Button>
                </>
            )}
            {mode === PageMode.edit && (
                <>
                    <TextareaAutosize value={tempContent} onChange={changeContentEvent} id='editArea' minRows='20'></TextareaAutosize>
                    <Button variant="contained" onClick={savePageEvent}>{t("Save")}</Button>
                    <Button variant="contained" onClick={cancelEditionEvent}>{t("Cancel")}</Button>
                </>
            )}
            <ul>
            {categories.map((category) => (
                <li key={'category-' + category.name}>
                    {category.name} -
                </li>
            ))}
            </ul>
        </>
    )
}


