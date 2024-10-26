import {Params, useParams} from "react-router-dom";
import {ChangeEvent, useEffect, useState} from 'react';
import {PageMode} from "../model/page/PageMode.ts";
import {PageStatus} from "../model/page/PageStatus.ts";
import {clone} from "../service/Common.ts";

function Page() {

    const [pageStatus, setPageStatus] = useState(getCommand(useParams()));

    useEffect(() => {
        document.title = 'Datalinks' + ' - ' + pageStatus.article.title;
    }, [pageStatus.article.title]);

    function getCommand(useParams: Readonly<Params>) : PageStatus {
        const title = !useParams.title ? 'Índice' : useParams.title;
        const mode = !useParams.mode ? PageMode.read : PageMode[useParams.mode as keyof typeof PageMode];
        return {
            mode: mode,
            article: {
                title: title,
                content: 'cnsdkjfsdf',
            }
        }
    }

    function editPageEvent() : void {
        setPageStatus({mode: PageMode.edit, article: pageStatus.article, editingArticle: clone(pageStatus.article) })
    }

    function savePageEvent() : void {
        if (!pageStatus.editingArticle) { return; }

        setPageStatus({mode: PageMode.read, article: clone(pageStatus.editingArticle)})
    }

    function changeContentEvent(ev: ChangeEvent<HTMLTextAreaElement>) : void {
        if (!pageStatus.editingArticle) { return; }

        pageStatus.editingArticle.content = ev.target.value || '';
        setPageStatus({mode: pageStatus.mode, article: pageStatus.article, editingArticle: pageStatus.editingArticle });
    }

    function cancelEditionEvent() : void {
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
                    <textarea value={pageStatus.editingArticle?.content} onChange={changeContentEvent}></textarea>
                    <button onClick={savePageEvent}>Save</button>
                    <button onClick={cancelEditionEvent}>Cancel</button>
                </>
            )}
        </>
    )
}

export default Page;



