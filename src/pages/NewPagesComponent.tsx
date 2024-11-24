import {ChangeEvent, ReactNode, useEffect, useState} from 'react';
import {useDispatch} from "react-redux";
import {useTranslation} from "react-i18next";
import Typography from "@mui/material/Typography";
import {Page} from "../model/page/Page.ts";
import {formatDate, log} from "../service/Common.ts";
import {loadingOff, loadingOn} from "../redux/loadingSlice.ts";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow} from '@mui/material';
import {Link} from "react-router-dom";

export default function NewPagesComponent() : ReactNode | null {

    const { t } = useTranslation();
    const [pages, setPages] = useState<Page[]>([]);
    const [page, setPage] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(10);

    const dispatch = useDispatch();

    const fetchPages = async () : Promise<Page[]> => {
        log("Fetching pages: ");
        const requestOptions = {
            method: 'POST',
            body: JSON.stringify({
                page: page,
                pageSize: pageSize,
            }),
        };
        const data = await fetch(import.meta.env.VITE_API + '/page/newPages', requestOptions);
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
        listResult.then((data : Page[]) => {
            setPages(data);
        }).finally(() => {
            dispatch(loadingOff());
        });
    }

    useEffect(() => {
        log("NewPagesComponent useEffect");

        document.title = import.meta.env.VITE_SITE_TITLE + ' - ' + t("New pages");

        searchEvent();
    }, [page, pageSize]);

    return (
        <>
            <Typography variant="h2">{t("New pages")}</Typography>
            <TableContainer component={Paper}>
                <Table size="small" aria-label="a dense table">
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
                                    <Link to={'/page/' + row.title}>{row.title}</Link>
                                </TableCell>
                                <TableCell align="right">{formatDate(row.creationDate)}</TableCell>
                                <TableCell align="right"><Link to={'/user/' + row.creator?.username}>{row.creator?.username}</Link></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
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


