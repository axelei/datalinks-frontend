import {ReactNode, useEffect, useState} from 'react';
import {useLocation} from "react-router-dom";
import '../css/PageComponent.css';
import Typography from "@mui/material/Typography";
import {formatDate, log, insertPageJumps} from "../service/Common.ts";
import {Edit} from "../model/page/Edit.ts";
import {t} from "i18next";
import {fetchEdit} from "../service/EditService.ts";
import ReactDiffViewer from 'react-diff-viewer-continued';

export default function DiffComponent(): ReactNode | null {

    const location = useLocation();
    const editId1 = location.pathname.split('/')[2];
    const editId2 = location.pathname.split('/')[3];
    const [edit1, setEdit1] = useState<Edit>();
    const [edit2, setEdit2] = useState<Edit>();

    useEffect(() => {
        log("EditComponent page useEffect");
        const apiResponse = fetchEdit(editId1);
        apiResponse.then(data => {
            data.content = insertPageJumps(data.content);
            setEdit1({...data});
            document.title = import.meta.env.VITE_SITE_TITLE + ' - ' + data.id + " " + t("diff");
            window.scroll(0, 0);
        }).catch((error: Promise<string>) => {
            log("Edit fetch failed: " + error);
        });
        const apiResponse2 = fetchEdit(editId2);
        apiResponse2.then(data => {
            data.content = insertPageJumps(data.content);
            setEdit2({...data});
            window.scroll(0, 0);
        }).catch((error: Promise<string>) => {
            log("Edit fetch failed: " + error);
        });

    }, [location.pathname]);

    return (
        <>
            <Typography variant="h2">{edit1?.title + t(" from: ") + formatDate(edit1?.date) + "/" + formatDate(edit2?.date)}</Typography>
            <Typography variant="h3">{t("By: ") + edit1?.username + "/" + edit2?.username}</Typography>
            <ReactDiffViewer oldValue={edit1?.content} newValue={edit2?.content} splitView={true} />
        </>
    )
}


