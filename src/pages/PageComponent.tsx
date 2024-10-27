import {ChangeEvent, ReactNode, useEffect, useState} from 'react';
import {PageMode} from "../model/page/PageMode.ts";
import {useLocation, useSearchParams} from "react-router-dom";

export default function PageComponent() : ReactNode | null {

    const fetchPage = (title : string) : void => {
        fetch('http://localhost:8080/page/' + title)
            .then(response => response.json())
            .then(response => {
                console.log(response.title);
                setTitle(response.title);
                setContent(response.content);
                document.title = 'Datalinks' + ' - ' + response.title;
            });
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
        fetchPage(currentTitle);
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


