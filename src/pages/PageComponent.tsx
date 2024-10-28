import {ChangeEvent, ReactNode, useEffect, useState} from 'react';
import {PageMode} from "../model/page/PageMode.ts";
import {useLocation} from "react-router-dom";
import {Page} from "../model/page/Page.ts";
import Button from '@mui/material/Button';
import {TextareaAutosize} from "@mui/material";
import LoadingModal from "../components/LoadingModal.tsx";

export default function PageComponent() : ReactNode | null {

    const fetchPage = async (title : string) : Promise<Page> => {
        const data = await fetch('http://localhost:8080/page/' + title);
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
        return await fetch('http://localhost:8080/page/' + title, requestOptions);
    }

    const editPageEvent = () : void => {
        setMode(PageMode.edit);
        setTempContent(content);
    }

    const savePageEvent = () : void => {
        setLoading(true);
        const saveResult = savePage();
        saveResult.then(value => {
            console.log(value);
            setMode(PageMode.read);
            setContent(tempContent);
            setLoading(false);
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

    const [loading, setLoading] = useState(false);

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
            <LoadingModal loading={loading} />
            <h1>{title}</h1>
            {mode === PageMode.read && (
                <>
                    <article>{content}</article>
                    <Button variant="contained" onClick={editPageEvent}>Edit</Button>
                </>
            )}
            {mode === PageMode.edit && (
                <>
                    <TextareaAutosize value={tempContent} onChange={changeContentEvent}></TextareaAutosize>
                    <Button variant="contained" onClick={savePageEvent}>Save</Button>
                    <Button variant="contained" onClick={cancelEditionEvent}>Cancel</Button>
                </>
            )}
        </>
    )
}


