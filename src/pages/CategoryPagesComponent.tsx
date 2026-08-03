import {ReactNode, useEffect, useState} from 'react';
import {useAppDispatch} from "../hooks.ts";
import {useTranslation} from "react-i18next";
import Typography from "@mui/material/Typography";
import {Page} from "../model/page/Page.ts";
import {formatDate} from "../service/Common.ts";
import {loadingOff, loadingOn} from "../redux/loadingSlice.ts";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow} from '@mui/material';
import {Link, useParams} from "react-router-dom";
import {findPagesInCategory} from "../service/CategoryService.ts";
import {usePagination} from "../service/usePagination.ts";

export default function CategoryPagesComponent() : ReactNode | null {

    const { t } = useTranslation();
    const [pages, setPages] = useState<Page[]>([]);
    const { page, pageSize, handleChangePage, handleChangeRowsPerPage } = usePagination();
    const { query } = useParams<{ query: string }>();
    const category = decodeURIComponent(query ?? '');

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!category) return;

        document.title = import.meta.env.VITE_SITE_TITLE + ' - ' + t("Category") + ": " + category;

        dispatch(loadingOn());
        findPagesInCategory(category, page, pageSize).then((data : Page[]) => {
            setPages(data);
        }).finally(() => {
            dispatch(loadingOff());
        });
    }, [category, page, pageSize, dispatch, t]);

    return (
        <>
            <Typography variant="h2">{t("Pages from category:") + " " + category}</Typography>
            <TableContainer component={Paper}>
                <Table size="small">
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
                    <Typography sx={{ p: 2 }}>{t("No pages found in this category.")}</Typography>
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
