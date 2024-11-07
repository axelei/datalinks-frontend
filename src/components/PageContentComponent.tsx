import {ReactNode} from "react";
import {parseMain} from "../service/PageRendering.ts";

interface Props {
    content: string;
}

export default function PageContentComponent( props : Props) : ReactNode | null {

    const content = parseMain(props.content);

    return (
        <>
            <article dangerouslySetInnerHTML={{ __html: content }}></article>
        </>
    )
}