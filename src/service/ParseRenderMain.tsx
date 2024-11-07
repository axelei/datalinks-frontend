import parse, {DOMNode, domToReact, HTMLReactParserOptions} from 'html-react-parser';
import {ElementType} from "domelementtype";
import {Link} from "react-router-dom";

export const parseRenderMain = (content: string) : ReturnType<typeof domToReact> => {

    const options: HTMLReactParserOptions = {
        trim: true,
        replace: (element : DOMNode) => {
            if (element.type == ElementType.Tag && element.name == 'a') {
                if (element.attribs.href.startsWith(import.meta.env.VITE_SITE_URL)) {
                    const page = element.attribs.href.replace(import.meta.env.VITE_SITE_URL + '/Page/', '');
                    return (<Link to={'page/' + page}>{domToReact(element.childNodes as DOMNode[], options)}</Link>);
                } else {
                    element.attribs.target = '_blank';
                }
            }
        }
    };


    return parse(content, options);
}