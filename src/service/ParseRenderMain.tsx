import parse, {DOMNode, domToReact, HTMLReactParserOptions} from 'html-react-parser';
import type {Element} from 'domhandler';
import {ElementType} from "domelementtype";
import {Link} from "react-router-dom";
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import {Tooltip} from "@mui/material";
import {SyntheticEvent} from "react";

export const parseRenderMain = (content: string, tooltipContent : string, handleTooltipOpen: (event: SyntheticEvent) => void) : ReturnType<typeof domToReact> => {

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
                    return (<Tooltip title={tooltipContent} arrow onOpen={handleTooltipOpen}><Link to={'/' + page}>{domToReact(element.childNodes as DOMNode[], options)}</Link></Tooltip>);
                } else {
                    const text = (element.children[0] as unknown as Text).data;
                    return (<><a href={element.attribs.href} target="_blank" rel="nofollow">{text}<InsertLinkIcon fontSize="small" sx={{verticalAlign: "middle"}} /></a></>);
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