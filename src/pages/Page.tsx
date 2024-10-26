import {Params, useParams} from "react-router-dom";
import {ChangeEvent, useState} from 'react';
import {PageMode} from "../model/PageMode.ts";
import {PageStatus} from "../model/PageStatus.ts";
import {clone} from "../service/Common.ts";

function Page() {

    const [pageStatus, setPageStatus] = useState(getCommand(useParams()));

    function getCommand(useParams: Readonly<Params>) : PageStatus {
        const title = !useParams.title ? 'Índice' : useParams.title;
        const mode = !useParams.mode ? PageMode.read: mapToEnum(useParams.mode);
        return {
            mode: mode,
            article: {
                title: title,
                content: 'cnsdkjfsdf',
            }
        }
    }

    function mapToEnum(mode: string) {
        switch (mode) {
            case 'edit': return PageMode.edit;
            default: return PageMode.read;
        }
    }

    function editPageEvent() {
        setPageStatus({mode: PageMode.edit, article: pageStatus.article, editingArticle: clone(pageStatus.article) })
    }

    function savePageEvent() {
        setPageStatus({mode: PageMode.read, article: clone(pageStatus.editingArticle)})
    }

    function changeContentEvent(ev: ChangeEvent<HTMLTextAreaElement>) {
        pageStatus.editingArticle.content = ev.target.value || '';
        setPageStatus({mode: pageStatus.mode, article: pageStatus.article, editingArticle: pageStatus.editingArticle });
    }

    function cancelEditionEvent() {
        setPageStatus({mode: PageMode.read, article: pageStatus.article });
    }

    return (
        <>
        <h1>{pageStatus.article.title}</h1>
        {pageStatus.mode === PageMode.read && (
            <>
                <article>{pageStatus.article.content}</article>
                <button onClick={editPageEvent}>Edit</button>
            </>
        )}
            {pageStatus.mode === PageMode.edit && (
                <>
                    <textarea value={pageStatus.editingArticle.content} onChange={changeContentEvent}></textarea>
                    <button onClick={savePageEvent}>Save</button>
                    <button onClick={cancelEditionEvent}>Cancel</button>
                </>
            )}
        </>
    )
}

export default Page;



