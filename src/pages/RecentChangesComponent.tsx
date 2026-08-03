import {ReactNode, useEffect, useState} from 'react';
import {useAppDispatch} from "../hooks.ts";
import {useTranslation} from "react-i18next";
import Typography from "@mui/material/Typography";
import {formatDate} from "../service/Common.ts";
import {loadingOff, loadingOn} from "../redux/loadingSlice.ts";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material';
import {Link} from "react-router-dom";
import {Edit} from "../model/page/Edit.ts";
import {fetchRecentChanges} from "../service/EditService.ts";
import {usePagination} from "../service/usePagination.ts";
import AppTablePagination from "../components/AppTablePagination.tsx";

export default function RecentChangesComponent() : ReactNode | null {

    const { t } = useTranslation();
    const [edits, setEdits] = useState<Edit[]>([]);
    const { page, pageSize, handleChangePage, handleChangeRowsPerPage } = usePagination();

    const dispatch = useAppDispatch();

    useEffect(() => {
        document.title = import.meta.env.VITE_SITE_TITLE + ' - ' + t("Recent changes");

        dispatch(loadingOn());
        fetchRecentChanges(page, pageSize).then((data : Edit[]) => {
            setEdits(data);
        }).finally(() => {
            dispatch(loadingOff());
        });
    }, [page, pageSize, dispatch, t]);

    return (
        <>
            <Typography variant="h2">{t("Recent changes")}</Typography>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>{t("Title")}</TableCell>
                            <TableCell align="right">{t("Modified date")}</TableCell>
                            <TableCell align="right">{t("User")}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {edits.map((row : Edit) => (
                            <TableRow
                                key={row.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row" style={{whiteSpace: "normal", wordBreak: "break-word"}}>
                                    <Link to={'/page/' + encodeURIComponent(row.page?.title ?? '')}>{row.page?.title}</Link>
                                </TableCell>
                                <TableCell align="right"><Link to={'/edit/' + row.id}>{formatDate(row.date)}</Link></TableCell>
                                <TableCell align="right"><Link to={'/user/' + encodeURIComponent(row.user?.username ?? '')}>{row.user?.username}</Link></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {edits.length === 0 && (
                    <Typography sx={{ p: 2 }}>{t("No recent changes found.")}</Typography>
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
