import {ReactNode, SyntheticEvent, useEffect, useState} from "react";
import {parseRenderMain} from "../service/ParseRenderMain.tsx";
import "ckeditor5/ckeditor5-content.css";
import Typography from "@mui/material/Typography";
import {t} from "i18next";
import {Category} from "../model/page/Category.ts";
import {Page} from "../model/page/Page.ts";
import {Chip, Stack} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {fetchPageShort} from "../service/PageService.ts";
import {useAppSelector} from "../hooks.ts";


interface Props {
    page: Page;
}

export default function PageContentComponent( props : Props) : ReactNode | null {

    const [dynamicTooltipContent, setDynamicTooltipContent] = useState(t("Loading..."));

    const loggedUser = useAppSelector((state) => state.loggedUser);

    const handleTooltipOpen = (event: SyntheticEvent) : void => {
        const target = event.target as HTMLAnchorElement;
        const page = target.href.substring(target.href.lastIndexOf('/') + 1);
        fetchPageShort(page, loggedUser.token).then((data: Page) => {
            setDynamicTooltipContent(data.summary || "");
        }).catch(() => {
            target.style.color = "red";
            setDynamicTooltipContent(t("Error loading page"));
        });
    }

    const content = parseRenderMain(props.page.content || "", dynamicTooltipContent, handleTooltipOpen);
    const navigate = useNavigate();

    useEffect(() => {

    }, []);

    return (
        <>
            <article className="ck-content">{content}</article>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                {props.page.categories?.map((category : Category, index : number) => (
                    <Chip
                        key={index}
                        label={category.name}
                        color="primary"
                        onClick={() => navigate('/category/' + category.name)}
                    />
                ))}
            </Stack>
            {!props.page.content && (<Typography>{t("This page doesn't have any content yet.")}</Typography>)}
        </>
    )
}