import {ChangeEvent, ReactNode, useEffect, useState} from 'react';
import {PageMode} from "../model/page/PageMode.ts";
import {useLocation} from "react-router-dom";
import {Page} from "../model/page/Page.ts";
import Button from '@mui/material/Button';
import {TextareaAutosize} from "@mui/material";
import '../css/pagecomponent.css';
import {useDispatch} from "react-redux";
import {loadingOff, loadingOn} from "../redux/loadingSlice.ts";
import {Category} from "../model/page/Category.ts";

export default function PageComponent() : ReactNode | null {

    const fetchPage = async (title : string) : Promise<Page> => {
        const data = await fetch(import.meta.env.VITE_API + '/page/' + title);
        return data.json();
    }

    const savePage = async () : Promise<object> => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
                'user-token': 'gñap'
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
            dispatch(loadingOff());
        });
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
            currentTitle = 'Índice';
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
                    <Button variant="contained" onClick={editPageEvent}>Edit</Button>
                </>
            )}
            {mode === PageMode.edit && (
                <>
                    <TextareaAutosize value={tempContent} onChange={changeContentEvent} id='editArea' minRows='20'></TextareaAutosize>
                    <Button variant="contained" onClick={savePageEvent}>Save</Button>
                    <Button variant="contained" onClick={cancelEditionEvent}>Cancel</Button>
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


