import {ReactNode} from "react";
import {parseRenderMain} from "../service/ParseRenderMain.tsx";
import "ckeditor5/ckeditor5-content.css";
import Typography from "@mui/material/Typography";
import {t} from "i18next";
import {Category} from "../model/page/Category.ts";
import {Page} from "../model/page/Page.ts";
import {Chip, Stack} from "@mui/material";
import {useNavigate} from "react-router-dom";


interface Props {
    page: Page;
}

export default function PageContentComponent( props : Props) : ReactNode | null {

    const content = parseRenderMain(props.page.content || "");
    const navigate = useNavigate();

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
            {!content && (<Typography>{t("This page doesn't have any content yet.")}</Typography>)}
        </>
    )
}