import {ChangeEvent, ReactNode, useEffect, useState} from 'react';
import {useDispatch} from "react-redux";
import {useTranslation} from "react-i18next";
import Typography from "@mui/material/Typography";
import {Page} from "../model/page/Page.ts";
import {log} from "../service/Common.ts";
import {loadingOff, loadingOn} from "../redux/loadingSlice.ts";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow} from '@mui/material';
import {Link} from "react-router-dom";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

export default function SearchComponent() : ReactNode | null {

    const { t } = useTranslation();
    const [pages, setPages] = useState<Page[]>([]);
    const [page, setPage] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(10);
    const [query, setQuery] = useState<string>('');

    const dispatch = useDispatch();

    const search = async (query: string): Promise<Page[]> => {
        log("Fetching query: " + query);
        const data = await fetch(import.meta.env.VITE_API + '/page/-search/' + query);
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
        const queryString = location.pathname.split('/')[2];
        dispatch(loadingOn());
        const listResult = search(queryString);
        listResult.then((data : Page[]) => {
            setPages(data);
        }).finally(() => {
            dispatch(loadingOff());
        });
    }

    useEffect(() => {
        log("SearchComponents search useEffect");
        searchEvent();
    }, [query, page, pageSize, location.pathname]);

    useEffect(() => {
        log("SearchComponents setQuery useEffect");

        document.title = import.meta.env.VITE_SITE_TITLE + ' - ' + t("Search");
        setQuery(location.pathname.split('/')[2]);

    }, [t, location.pathname]);

    return (
        <>
            <Typography variant="h2">{t("Search results") + ": " + decodeURIComponent(query)}</Typography>
            <List>
                {pages.map((row : Page) => (
                    <ListItem key={row.slug}>
                        <ListItemText
                            primary={row.title}
                            secondary={row.summary}
                        />
                    </ListItem>
                ))}
            </List>
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


