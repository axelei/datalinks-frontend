import {ReactNode} from "react";
import {parseRenderMain} from "../service/ParseRenderMain.tsx";
import "ckeditor5/ckeditor5-content.css";
import Typography from "@mui/material/Typography";
import {t} from "i18next";


interface Props {
    content: string | undefined;
}

export default function PageContentComponent( props : Props) : ReactNode | null {

    const content = parseRenderMain(props.content || "");

    return (
        <>
            <article className="ck-content">{content}</article>
            {!props.content && (<Typography>{t("This page doesn't have any content yet.")}</Typography>)}
        </>
    )
}