import parse, {DOMNode, domToReact, HTMLReactParserOptions} from 'html-react-parser';
import type { Element } from 'domhandler';
import {ElementType} from "domelementtype";
import {Link} from "react-router-dom";
import LinkIcon from '@mui/icons-material/Link';


export const parseRenderMain = (content: string) : ReturnType<typeof domToReact> => {

    const stripElement = (element: string) => {
        return element.substring(element.lastIndexOf(import.meta.env.VITE_SITE_URL) + import.meta.env.VITE_SITE_URL.length + 1);
    }

    const stripElementServer = (element: string) => {
        return element.substring(element.lastIndexOf(import.meta.env.VITE_API) + import.meta.env.VITE_API.length + 1);
    }

    const afterSlash = (element: string) => {
        return element.substring(element.lastIndexOf('/') + 1);
    }

    const options: HTMLReactParserOptions = {
        trim: true,
        replace: (element : DOMNode) => {

            if (element.type == ElementType.Tag
                && element.name.toLowerCase() == 'a') {
                if (element.attribs.href.toLowerCase().startsWith(import.meta.env.VITE_SITE_URL.toLowerCase())) {
                    const page = stripElement(element.attribs.href);
                    return (<Link to={'/' + page}>{domToReact(element.childNodes as DOMNode[], options)}<LinkIcon fontSize="small" /></Link>);
                } else {
                    element.attribs.target = '_blank';
                    element.attribs.rel = 'nofollow'
                }
            }

            if (element.type == ElementType.Tag
                && element.name.toLowerCase() == 'img'
                && !element.attribs.parsed
                && (element.parent as Element).name.toLowerCase() != 'a') {
                if (element.attribs.src.toLowerCase().startsWith(import.meta.env.VITE_API.toLowerCase())) {
                    const upload = stripElementServer(element.attribs.src);
                    element.attribs.parsed = "true";
                    return (<Link to={'/upload/' + afterSlash(upload)}>{domToReact([element] as DOMNode[], options)}</Link>);
                }
            }
        }
    };


    return parse(content, options);
}