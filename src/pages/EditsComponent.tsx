import {ChangeEvent, ReactNode, useEffect, useState} from 'react';
import {useDispatch} from "react-redux";
import {useTranslation} from "react-i18next";
import Typography from "@mui/material/Typography";
import {formatDate, log} from "../service/Common.ts";
import {loadingOff, loadingOn} from "../redux/loadingSlice.ts";
import {
    Paper,
    Radio,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow
} from '@mui/material';
import {Link, useNavigate} from "react-router-dom";
import {Edit} from "../model/page/Edit.ts";
import Button from "@mui/material/Button";

export default function EditsComponent() : ReactNode | null {

    const { t } = useTranslation();
    const [edits, setEdits] = useState<Edit[]>([]);
    const [page, setPage] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(10);
    const currentTitle = decodeURIComponent(location.pathname.split('/')[2]);
    const navigate = useNavigate();

    const [diff1, setDiff1] = useState<string>('');
    const [diff2, setDiff2] = useState<string>('');

    const dispatch = useDispatch();

    const fetchPages = async () : Promise<Edit[]> => {
        log("Fetching pages: ");

        const data = await fetch(import.meta.env.VITE_API + '/page/-edits/' + currentTitle + '?page=' + page + '&pageSize=' + pageSize);
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
        listResult.then((data : Edit[]) => {
            setEdits(data);
        }).finally(() => {
            dispatch(loadingOff());
        });
    }

    const diff1radioChange = (event : ChangeEvent<HTMLInputElement>) => {
        setDiff1(event.target.value);
    };
    const diff2radioChange = (event : ChangeEvent<HTMLInputElement>) => {
        setDiff2(event.target.value);
    };
    const executeCompare = () => {
        navigate('/diff/' + diff1 + '/' + diff2);
    }


    useEffect(() => {
        log("EditsComponent useEffect");

        document.title = import.meta.env.VITE_SITE_TITLE + ' - ' + currentTitle + ' ' + t("Edits");

        searchEvent();
    }, [page, pageSize]);

    return (
        <>
            <Typography variant="h2">{t("Edits for: ") + currentTitle}</Typography>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell>{t("Username")}</TableCell>
                            <TableCell align="right">{t("Date")}</TableCell>
                            <TableCell align="center">{t("Compare") + " 1"}</TableCell>
                            <TableCell align="center">{t("Compare") + " 2"}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {edits.map((row : Edit) => (
                            <TableRow
                                key={row.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    <Link to={'/user/' + row.user?.username}>{row.user?.username}</Link>
                                </TableCell>
                                <TableCell align="right"><Link to={"/edit/" + row.id}>{formatDate(row.date)}</Link></TableCell>
                                <TableCell align="center">
                                    <Radio
                                        checked={diff1 === row.id}
                                        onChange={diff1radioChange}
                                        value={row.id}
                                        name="radio-buttons-1"
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <Radio
                                        checked={diff2 === row.id}
                                        onChange={diff2radioChange}
                                        value={row.id}
                                        name="radio-buttons-2"
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                        <TableRow
                            key={''}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell><Button onClick={executeCompare} variant="contained" disabled={!diff1 || !diff2 || diff1 == diff2}>{t("Compare")}</Button></TableCell>
                        </TableRow>
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


