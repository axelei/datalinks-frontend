import {Params, useParams} from "react-router-dom";
import {useState} from 'react';
import {PageMode} from "../model/PageMode.ts";
import {PageStatus} from "../model/PageStatus.ts";

function Page() {

    const [pageStatus, setPageStatus] = useState(getCommand(useParams()));

    function getCommand(useParams: Readonly<Params>) : PageStatus {
        const title = !useParams.title ? 'Índice' : useParams.title;
        const mode = !useParams.mode ? PageMode.read: mapToEnum(useParams.mode);
        return {
            mode: mode,
            page: {
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

    function toEditPage() {
        setPageStatus({mode: PageMode.edit, page: pageStatus.page})
    }

    function savePage() {
        setPageStatus({mode: PageMode.read, page: pageStatus.page})
    }

    function changeContent(content: string | null) {
        pageStatus.page.content = content || '';
        setPageStatus({mode: pageStatus.mode, page: pageStatus.page});
    }

    return (
        <>
        <h1>{pageStatus.page.title}</h1>
        {pageStatus.mode === PageMode.read && (
            <>
                <article>{pageStatus.page.content}</article>
                <button onClick={toEditPage}>Edit</button>
            </>
        )}
        {pageStatus.mode === PageMode.edit && (
            <>
                <textarea value={pageStatus.page.content} onChange={ev => changeContent(ev.target.value)}></textarea>
                <button onClick={savePage}>Save</button>
            </>
        )}
        </>
    )
}

export default Page;



