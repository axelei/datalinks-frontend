import {ChangeEvent, ReactNode, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {formatDate, log} from "../service/Common.ts";
import Typography from "@mui/material/Typography";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow} from "@mui/material";
import {User} from "../model/user/User.ts";
import {Link} from "react-router-dom";
import {Edit} from "../model/page/Edit.ts";

interface Props {
    user : User;
}

export default function ContributionsComponent( props : Props) : ReactNode | null {

    const { t } = useTranslation();
    const [edits, setEdits] = useState<Edit[]>([]);
    const [page, setPage] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(10);

    const fetchEdits = async () : Promise<Edit[]> => {
        log("Fetching edits: ");
        const data = await fetch(import.meta.env.VITE_API + '/page/-contributions/' + props.user.username + "?page=" + page + "&pageSize=" + pageSize);
        if (data.ok) {
            return data.json();
        } else {
            return Promise.reject(data.text());
        }
    }

    useEffect(() => {
        log("ContributionsComponent useEffect");

        fetchEdits().then((data : Edit[]) => {
            setEdits(data);
        }).catch(() => {
            setEdits([]);
        });

    }, [props.user, page, pageSize]);

    const handleChangePage = (_event: unknown, newPage: number) : void => {
        setPage(newPage);
    }

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) : void => {
        setPageSize(parseInt(event.target.value, 10));
    }

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
                                    <Link to={'/page/' + row.page?.title}>{row.page?.title}</Link>
                                </TableCell>
                                <TableCell align="right"><Link to={'/edit/' + row.id}>{formatDate(row.date)}</Link></TableCell>
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