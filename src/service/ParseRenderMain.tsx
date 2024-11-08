import parse, {DOMNode, domToReact, HTMLReactParserOptions} from 'html-react-parser';
import {ElementType} from "domelementtype";
import {Link} from "react-router-dom";
import LinkIcon from '@mui/icons-material/Link';


export const parseRenderMain = (content: string) : ReturnType<typeof domToReact> => {

    const options: HTMLReactParserOptions = {
        trim: true,
        replace: (element : DOMNode) => {
            if (element.type == ElementType.Tag && element.name == 'a') {
                if (element.attribs.href.toLowerCase().startsWith(import.meta.env.VITE_SITE_URL.toLowerCase() + '/page/')) {
                    const page = element.attribs.href.substring(element.attribs.href.lastIndexOf('/') + 1);
                    return (<Link to={'/page/' + page}>{domToReact(element.childNodes as DOMNode[], options)}<LinkIcon fontSize="small" /></Link>);
                } else {
                    element.attribs.target = '_blank';
                }
            }
        }
    };


    return parse(content, options);
}