import {ReactNode} from "react";
import {parseRenderMain} from "../service/ParseRenderMain.tsx";

interface Props {
    content: string;
}

export default function PageContentComponent( props : Props) : ReactNode | null {

    const content = parseRenderMain(props.content);

    return (
        <>
            <article>{content}</article>
        </>
    )
}