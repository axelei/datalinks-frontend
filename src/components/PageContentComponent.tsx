import {ReactNode} from "react";
import {parseRenderMain} from "../service/ParseRenderMain.tsx";
import "ckeditor5/ckeditor5-content.css";


interface Props {
    content: string;
}

export default function PageContentComponent( props : Props) : ReactNode | null {

    const content = parseRenderMain(props.content);

    return (
        <>
            <article className="ck-content">{content}</article>
        </>
    )
}