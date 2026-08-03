import {ReactNode, useEffect, useState} from 'react';
import {useAppDispatch} from "../hooks.ts";
import {useTranslation} from "react-i18next";
import Typography from "@mui/material/Typography";
import {loadingOff, loadingOn} from "../redux/loadingSlice.ts";
import {ImageList, ImageListItem, ImageListItemBar, TablePagination} from '@mui/material';
import {Upload} from "../model/upload/Upload.ts";
import {Link} from "react-router-dom";
import {fetchNewUploads} from "../service/UploadService.ts";
import {usePagination} from "../service/usePagination.ts";

export default function NewUploadsComponent() : ReactNode | null {

    const { t } = useTranslation();
    const [uploads, setUploads] = useState<Upload[]>([]);
    const { page, pageSize, handleChangePage, handleChangeRowsPerPage } = usePagination();
    const [timesFit, setTimesFit] = useState(5);

    const dispatch = useAppDispatch();

    const calculateFit = ()=> {
        const windowWidth = window.innerWidth;
        const devicePixelRatio = window.devicePixelRatio || 1;
        const fitInWidth = Math.floor((windowWidth - 200) / (150  * devicePixelRatio));
        const fitAtLeastOne = Math.max(fitInWidth, 1);
        setTimesFit(Math.min(fitAtLeastOne, 5))
    }

    useEffect(() => {
        document.title = import.meta.env.VITE_SITE_TITLE + ' - ' + t("New uploads");
        calculateFit();

        dispatch(loadingOn());
        fetchNewUploads(page, pageSize).then((data : Upload[]) => {
            setUploads(data);
        }).finally(() => {
            dispatch(loadingOff());
        });
    }, [page, pageSize, dispatch, t]);

    return (
        <>
            <Typography variant="h2">{t("New uploads")}</Typography>
            <ImageList cols={timesFit}>
                {uploads.map((item) => (
                    <Link to={'/upload/' + encodeURIComponent(item.slug ?? '')} key={item.slug}>
                        <ImageListItem key={item.slug}>
                            <img
                                src={import.meta.env.VITE_API + '/file/get/' + encodeURIComponent(item.slug ?? '')}
                                alt={item.filename}
                                loading="lazy"
                            />
                            <ImageListItemBar key={item.slug}
                                title={item.filename}
                                subtitle={<span>{item.description}</span>}
                                position="below"
                                style={{whiteSpace: "normal", wordBreak: "break-word"}}
                            />
                        </ImageListItem>
                    </Link>
                ))}
            </ImageList>
            {uploads.length === 0 && (
                <Typography sx={{ p: 2 }}>{t("No new uploads found.")}</Typography>
            )}
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
