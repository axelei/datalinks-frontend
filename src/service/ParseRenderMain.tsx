import parse, {DOMNode, domToReact, Element as HtmlElement, HTMLReactParserOptions, Text as HtmlText} from 'html-react-parser';
import {Link} from "react-router-dom";
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import {Tooltip} from "@mui/material";
import {SyntheticEvent} from "react";

type TagNode = HtmlElement & {
    children?: DOMNode[];
    childNodes?: DOMNode[];
    attribs: Record<string, string>;
    name: string;
    parent: TagNode | null;
};

const isTagNode = (node: DOMNode): node is TagNode => {
    return node.type === 'tag' && 'name' in node;
};

export const parseRenderMain = (content: string, tooltipContent : string, handleTooltipOpen: (event: SyntheticEvent) => void) : ReturnType<typeof domToReact> => {

    const stripElement = (element: string): string => {
        return element.substring(element.lastIndexOf(import.meta.env.VITE_SITE_URL) + import.meta.env.VITE_SITE_URL.length + 1);
    }

    const stripElementServer = (element: string): string => {
        return element.substring(element.lastIndexOf(import.meta.env.VITE_API) + import.meta.env.VITE_API.length + 1);
    }

    const afterSlash = (element: string): string => {
        return element.substring(element.lastIndexOf('/') + 1);
    }

    const options: HTMLReactParserOptions = {
        trim: true,
        replace: (element : DOMNode) => {
            if (!isTagNode(element)) return;

            const name = element.name;
            const attribs = element.attribs ?? {};
            const parentName = element.parent && isTagNode(element.parent) ? element.parent.name : '';

            const siteUrl = (import.meta.env.VITE_SITE_URL ?? '').toString();
            const apiUrl = (import.meta.env.VITE_API ?? '').toString();

            if (name.toLowerCase() === 'a') {
                const href = (attribs.href ?? '');
                if (href.toLowerCase().startsWith(siteUrl.toLowerCase())) {
                    const page = stripElement(href);
                    const children = element.children ?? element.childNodes ?? [];
                    return (<Tooltip title={tooltipContent} arrow onOpen={handleTooltipOpen}><Link to={'/' + page}>{domToReact(children as DOMNode[], options)} </Link></Tooltip>);
                } else {
                    const firstChild = element.children?.[0];
                    const text = firstChild && isTagNode(firstChild) ? '' : (firstChild as HtmlText | undefined)?.data ?? attribs.href ?? '';
                    return (<><a href={attribs.href} target="_blank" rel="nofollow noopener noreferrer">{text}<InsertLinkIcon fontSize="small" sx={{verticalAlign: "middle"}} /> </a></>);
                }
            }

            if (name.toLowerCase() === 'img' && !attribs.parsed && parentName.toLowerCase() !== 'a') {
                const src = (attribs.src ?? '');
                if (src.toLowerCase().startsWith(apiUrl.toLowerCase())) {
                    const upload = stripElementServer(src);
                    attribs.parsed = "true";
                    return (<Link to={'/upload/' + afterSlash(upload)}>{domToReact([element] as DOMNode[], options)}</Link>);
                }
            }
        }
    };


    return parse(content, options);
}