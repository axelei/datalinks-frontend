import parse, {DOMNode, domToReact, HTMLReactParserOptions} from 'html-react-parser';
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
            // Use runtime checks to avoid type-specific imports
            const node: any = element as any;
            if (!node || node.type !== 'tag') return;

            const name = typeof node.name === 'string' ? node.name : '';
            const attribs = node.attribs ?? {};
            const parentName = node.parent && typeof node.parent.name === 'string' ? node.parent.name : '';

            const siteUrl = (import.meta.env.VITE_SITE_URL ?? '').toString();
            const apiUrl = (import.meta.env.VITE_API ?? '').toString();

            if (name.toLowerCase() === 'a') {
                const href = (attribs.href ?? '');
                if (href.toLowerCase().startsWith(siteUrl.toLowerCase())) {
                    const page = stripElement(href);
                    const children = node.children ?? node.childNodes ?? [];
                    return (<Tooltip title={tooltipContent} arrow onOpen={handleTooltipOpen}><Link to={'/' + page}>{domToReact(children as DOMNode[], options)} </Link></Tooltip>);
                } else {
                    const text = (node.children && node.children[0] && (node.children[0] as any).data) ? (node.children[0] as any).data : (attribs.href ?? '');
                    return (<><a href={attribs.href} target="_blank" rel="nofollow">{text}<InsertLinkIcon fontSize="small" sx={{verticalAlign: "middle"}} /> </a></>);
                }
            }

            if (name.toLowerCase() === 'img' && !attribs.parsed && parentName.toLowerCase() !== 'a') {
                const src = (attribs.src ?? '');
                if (src.toLowerCase().startsWith(apiUrl.toLowerCase())) {
                    const upload = stripElementServer(src);
                    (attribs as any).parsed = "true";
                    return (<Link to={'/upload/' + afterSlash(upload)}>{domToReact([node] as DOMNode[], options)}</Link>);
                }
            }
        }
    };


    return parse(content, options);
}