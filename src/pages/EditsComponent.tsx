import {ChangeEvent, ReactNode, useEffect, useState} from 'react';
import {useAppDispatch} from "../hooks.ts";
import {useTranslation} from "react-i18next";
import Typography from "@mui/material/Typography";
import {formatDate} from "../service/Common.ts";
import {loadingOff, loadingOn} from "../redux/loadingSlice.ts";
import {
    Paper,
    Radio,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';
import {Link, useLocation, useNavigate} from "react-router-dom";
import {Edit} from "../model/page/Edit.ts";
import Button from "@mui/material/Button";
import {fetchPageEdits} from "../service/EditService.ts";
import {usePagination} from "../service/usePagination.ts";
import AppTablePagination from "../components/AppTablePagination.tsx";

export default function EditsComponent() : ReactNode | null {

    const { t } = useTranslation();
    const [edits, setEdits] = useState<Edit[]>([]);
    const { page, pageSize, handleChangePage, handleChangeRowsPerPage } = usePagination();
    const location = useLocation();
    const navigate = useNavigate();

    const [diff1, setDiff1] = useState<string>('');
    const [diff2, setDiff2] = useState<string>('');

    const dispatch = useAppDispatch();

    const currentTitle = decodeURIComponent(location.pathname.split('/')[2]);

    const diff1radioChange = (event : ChangeEvent<HTMLInputElement>) => {
        setDiff1(event.target.value);
    };
    const diff2radioChange = (event : ChangeEvent<HTMLInputElement>) => {
        setDiff2(event.target.value);
    };
    const executeCompare = () => {
        navigate('/diff/' + encodeURIComponent(diff1) + '/' + encodeURIComponent(diff2));
    }

    useEffect(() => {
        document.title = import.meta.env.VITE_SITE_TITLE + ' - ' + currentTitle + ' ' + t("Edits");

        dispatch(loadingOn());
        fetchPageEdits(currentTitle, page, pageSize).then((data : Edit[]) => {
            setEdits(data);
        }).finally(() => {
            dispatch(loadingOff());
        });
    }, [currentTitle, page, pageSize, dispatch, t]);

    return (
        <>
            <Typography variant="h2">{t("Edits for: ") + currentTitle}</Typography>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label={t("a dense table")}>
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
                                    <Link to={'/user/' + encodeURIComponent(row.user?.username ?? '')}>{row.user?.username}</Link>
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
                {edits.length === 0 && (
                    <Typography sx={{ p: 2 }}>{t("No edits found.")}</Typography>
                )}
                <AppTablePagination
                    page={page}
                    pageSize={pageSize}
                    itemCount={edits.length}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>
        </>
    );
}
