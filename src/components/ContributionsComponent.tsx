import {ReactNode, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {formatDate, log} from "../service/Common.ts";
import Typography from "@mui/material/Typography";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {User} from "../model/user/User.ts";
import {Link} from "react-router-dom";
import {Edit} from "../model/page/Edit.ts";
import {fetchEdits} from "../service/EditService.ts";
import {usePagination} from "../service/usePagination.ts";
import AppTablePagination from "./AppTablePagination.tsx";

interface Props {
    user : User;
}

export default function ContributionsComponent( props : Props) : ReactNode | null {

    const { t } = useTranslation();
    const [edits, setEdits] = useState<Edit[]>([]);
    const { page, pageSize, handleChangePage, handleChangeRowsPerPage } = usePagination();

    useEffect(() => {
        log("ContributionsComponent useEffect");

        fetchEdits(props.user.username, page, pageSize).then((data : Edit[]) => {
            setEdits(data);
        }).catch(() => {
            setEdits([]);
        });

    }, [props.user, page, pageSize]);

    return (
        <>
            <Typography variant="h3">{t("Contributions")}</Typography>
            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>{t("Title")}</TableCell>
                            <TableCell align="right">{t("Date")}</TableCell>
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
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {edits.length === 0 && (
                    <Typography sx={{ p: 2 }}>{t("No contributions found.")}</Typography>
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