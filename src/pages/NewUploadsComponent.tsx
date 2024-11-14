import {ChangeEvent, ReactNode, useEffect, useState} from 'react';
import {useDispatch} from "react-redux";
import {useTranslation} from "react-i18next";
import Typography from "@mui/material/Typography";
import {log} from "../service/Common.ts";
import {loadingOff, loadingOn} from "../redux/loadingSlice.ts";
import {ImageList, ImageListItem, ImageListItemBar, TablePagination, useMediaQuery} from '@mui/material';
import {Upload} from "../model/upload/Upload.ts";
import {Link} from "react-router-dom";

export default function NewUploadsComponent() : ReactNode | null {

    const { t } = useTranslation();
    const [uploads, setUploads] = useState<Upload[]>([]);
    const [page, setPage] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(10);
    const isMobile = useMediaQuery('(max-width:600px)');


    const dispatch = useDispatch();

    const fetchPages = async () : Promise<Upload[]> => {
        log("Fetching uploads: ");
        const requestOptions = {
            method: 'POST',
            body: JSON.stringify({
                page: page,
                pageSize: pageSize,
            }),
        };
        const data = await fetch(import.meta.env.VITE_API + '/file/newUploads', requestOptions);
        if (data.ok) {
            return data.json();
        } else {
            return Promise.reject(data.text());
        }
    }

    const handleChangePage = (_event: unknown, newPage: number) : void => {
        setPage(newPage);
    }

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) : void => {
        setPageSize(parseInt(event.target.value, 10));
    }

    const searchEvent = () : void => {
        dispatch(loadingOn());
        const listResult = fetchPages();
        listResult.then((data : Upload[]) => {
            setUploads(data);
        }).finally(() => {
            dispatch(loadingOff());
        });
    }

    useEffect(() => {
        log("NewUploadsComponent useEffect");

        document.title = import.meta.env.VITE_SITE_TITLE + ' - ' + t("New uploads");

        searchEvent();
    }, [page, pageSize]);

    return (
        <>
            <Typography variant="h2">{t("New uploads")}</Typography>
            <ImageList cols={isMobile ? 1 : 5}>
                {uploads.map((item) => (
                    <Link to={'/upload/' + item.slug} key={item.slug}>
                        <ImageListItem key={item.slug}>
                            <img
                                src={import.meta.env.VITE_API + '/file/get/' + item.slug}
                                alt={item.filename}
                                loading="lazy"
                            />
                            <ImageListItemBar key={item.slug}
                                title={item.filename}
                                subtitle={<span>{item.description}</span>}
                                position="below"
                            />
                        </ImageListItem>
                    </Link>
                ))}
            </ImageList>
            <TablePagination
                rowsPerPageOptions={[10, 20, 50, 100]}
                component="div"
                count={-1}
                rowsPerPage={pageSize}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </>
    );
}


