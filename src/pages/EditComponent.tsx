import {ReactNode, useEffect, useState} from 'react';
import {useLocation} from "react-router-dom";
import '../css/PageComponent.css';
import Typography from "@mui/material/Typography";
import {formatDate, log} from "../service/Common.ts";
import PageContentComponent from "../components/PageContentComponent.tsx";
import {Edit} from "../model/page/Edit.ts";
import {t} from "i18next";

export default function EditComponent(): ReactNode | null {

    const location = useLocation();
    const editId = location.pathname.split('/')[2];
    const [edit, setEdit] = useState<Edit>();

    const fetchEdit = async (edit: string): Promise<Edit> => {
        log("Fetching edit: " + edit);
        const data = await fetch(import.meta.env.VITE_API + '/page/-edit/' + edit);
        if (data.ok) {
            return data.json();
        } else {
            return Promise.reject(data.text());
        }
    }

    useEffect(() => {
        log("EditComponent page useEffect");
        const apiResponse = fetchEdit(editId);
        apiResponse.then(data => {
            setEdit({...data});
            document.title = import.meta.env.VITE_SITE_TITLE + ' - ' + data.title + " " + t("edit");
            window.scroll(0, 0);
        }).catch((error: Promise<string>) => {
            log("Edit fetch failed: " + error);
        });

    }, [location.pathname]);

    return (
        <>
            <Typography variant="h2">{edit?.title + t(" from: ") + formatDate(edit?.date)}</Typography>
            <Typography variant="h3">{t("By: ") + edit?.username}</Typography>
            <PageContentComponent content={edit?.content}/>
        </>
    )
}


