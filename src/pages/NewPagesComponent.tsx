import {ReactNode, useEffect, useState} from 'react';
import {useAppDispatch} from "../hooks.ts";
import {useTranslation} from "react-i18next";
import Typography from "@mui/material/Typography";
import {Page} from "../model/page/Page.ts";
import {formatDate} from "../service/Common.ts";
import {loadingOff, loadingOn} from "../redux/loadingSlice.ts";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow} from '@mui/material';
import {Link} from "react-router-dom";
import {fetchNewPages} from "../service/PageService.ts";
import {usePagination} from "../service/usePagination.ts";

export default function NewPagesComponent() : ReactNode | null {

    const { t } = useTranslation();
    const [pages, setPages] = useState<Page[]>([]);
    const { page, pageSize, handleChangePage, handleChangeRowsPerPage } = usePagination();

    const dispatch = useAppDispatch();

    useEffect(() => {
        document.title = import.meta.env.VITE_SITE_TITLE + ' - ' + t("New pages");

        dispatch(loadingOn());
        fetchNewPages(page, pageSize).then((data : Page[]) => {
            setPages(data);
        }).finally(() => {
            dispatch(loadingOff());
        });
    }, [page, pageSize, dispatch, t]);

    return (
        <>
            <Typography variant="h2">{t("New pages")}</Typography>
            <TableContainer component={Paper}>
                <Table size="small" aria-label={t("a dense table")}>
                    <TableHead>
                        <TableRow>
                            <TableCell>{t("Title")}</TableCell>
                            <TableCell align="right">{t("Creation date")}</TableCell>
                            <TableCell align="right">{t("Creator")}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pages.map((row : Page) => (
                            <TableRow
                                key={row.slug}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row" style={{whiteSpace: "normal", wordBreak: "break-word"}}>
                                    <Link to={'/page/' + encodeURIComponent(row.title)}>{row.title}</Link>
                                </TableCell>
                                <TableCell align="right">{formatDate(row.creationDate)}</TableCell>
                                <TableCell align="right"><Link to={'/user/' + encodeURIComponent(row.creator?.username ?? '')}>{row.creator?.username}</Link></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {pages.length === 0 && (
                    <Typography sx={{ p: 2 }}>{t("No new pages found.")}</Typography>
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
            </TableContainer>
        </>
    );
}
