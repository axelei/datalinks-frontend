import {Params, useParams} from "react-router-dom";
import React, {ChangeEvent, ReactNode, useState} from 'react';
import {PageMode} from "../model/PageMode.ts";
import {PageStatus} from "../model/PageStatus.ts";

export default function Page(): ReactNode | null {

    const getCommand = ({ title, mode }: Readonly<Params>): PageStatus => {
        const currentTitle = !title ? 'Índice' : title;
        const currentMode = !mode ? PageMode.read : mapToEnum(mode);
        return {
            mode: currentMode,
            page: {
                title: currentTitle,
                content: 'cnsdkjfsdf',
            }
        };
    };

    const mapToEnum = (mode: string): number => {
        switch (mode) {
            case 'edit': return PageMode.edit;
            default: return PageMode.read;
        }
    };

    const [pageStatus, setPageStatus] = useState(getCommand(useParams()));
    const { mode, page } = pageStatus;
    const { title, content } = page;

    const toEditPage = () => setPageStatus({ mode: PageMode.edit, page: page });
    const savePage = () => setPageStatus({ mode: PageMode.read, page: page });

    const changeContent = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const value = event.target?.value;
        const textContent = value || '';

        setPageStatus({
            mode: pageStatus.mode,
            page: {
                ...pageStatus.page,
                content: textContent
            }
        });
    };

    return (
        <>
            <h1>{title}</h1>
            {mode === PageMode.read && (
                <>
                    <article>{content}</article>
                    <button onClick={toEditPage}>Edit</button>
                </>
            )}
            {mode === PageMode.edit && (
                <>
                    <textarea value={content} onChange={changeContent}></textarea>
                    <button onClick={savePage}>Save</button>
                </>
            )}
        </>
    );
}



