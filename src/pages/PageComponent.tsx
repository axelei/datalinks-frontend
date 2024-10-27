import {ChangeEvent, ReactNode, useEffect, useState} from 'react';
import {PageMode} from "../model/page/PageMode.ts";
import {useLocation} from "react-router-dom";
import {Page} from "../model/page/Page.ts";

export default function PageComponent() : ReactNode | null {

    const fetchPage = async (title : string) : Promise<Page> => {
        const data = await fetch('http://localhost:8080/page/' + title);
        return data.json();
    }

    const editPageEvent = () : void => {
        setMode(PageMode.edit);
        setTempContent(content);
    }

    const savePageEvent = () : void => {
        setMode(PageMode.read);
        setContent(tempContent);
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

            document.title = 'Datalinks' + ' - ' + data.title;
        })

    }, [location.pathname]);


    return (
        <>
        <h1>{title}</h1>
            {mode === PageMode.read && (
                <>
                    <article>{content}</article>
                    <button onClick={editPageEvent}>Edit</button>
                </>
            )}
            {mode === PageMode.edit && (
                <>
                    <textarea value={tempContent} onChange={changeContentEvent}></textarea>
                    <button onClick={savePageEvent}>Save</button>
                    <button onClick={cancelEditionEvent}>Cancel</button>
                </>
            )}
        </>
    )
}


