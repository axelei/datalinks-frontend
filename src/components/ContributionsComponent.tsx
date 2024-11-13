import {ReactNode, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {log} from "../service/Common.ts";
import Typography from "@mui/material/Typography";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {User} from "../model/user/User.ts";
import {Link} from "react-router-dom";
import {Edit} from "../model/page/Edit.ts";

interface Props {
    user : User;
}

export default function ContributionsComponent( props : Props) : ReactNode | null {

    const { t } = useTranslation();
    const [edits, setEdits] = useState<Edit[]>([]);

    const fetchEdits = async () : Promise<Edit[]> => {
        log("Fetching edits: ");
        const data = await fetch(import.meta.env.VITE_API + '/page/-contributions/' + props.user.username);
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

    }, [props.user]);

    return (
        <>
            <Typography variant="h3">{t("Contributions")}</Typography>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
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
                                <TableCell component="th" scope="row">
                                    <Link to={'/page/' + row.title}>{row.title}</Link>
                                </TableCell>
                                <TableCell align="right">{row.date?.toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {/*
                <TablePagination
                    rowsPerPageOptions={[10, 20, 50, 100]}
                    component="div"
                    count={-1}
                    rowsPerPage={pageSize}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
                */}
            </TableContainer>
        </>
    );

}