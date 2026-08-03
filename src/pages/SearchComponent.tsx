import {ReactNode, useEffect, useState} from 'react';
import {useAppDispatch} from "../hooks.ts";
import {useTranslation} from "react-i18next";
import Typography from "@mui/material/Typography";
import {Foundling} from "../model/search/Foundling.ts";
import {loadingOff, loadingOn} from "../redux/loadingSlice.ts";
import {Avatar, TablePagination} from '@mui/material';
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import {Link, useParams} from "react-router-dom";
import {FoundlingType, getFoundlingPath} from "../model/search/FoundlingType.ts";
import {searchFull} from "../service/SearchService.ts";
import {usePagination} from "../service/usePagination.ts";

export default function SearchComponent() : ReactNode | null {

    const { t } = useTranslation();
    const [foundlings, setFoundlings] = useState<Foundling[]>([]);
    const { page, pageSize, handleChangePage, handleChangeRowsPerPage } = usePagination();
    const { query: rawQuery } = useParams<{ query: string }>();
    const query = decodeURIComponent(rawQuery ?? '');

    const dispatch = useAppDispatch();

    useEffect(() => {
        document.title = import.meta.env.VITE_SITE_TITLE + ' - ' + t("Search");

        dispatch(loadingOn());
        searchFull(query, page, pageSize).then((data : Foundling[]) => {
            setFoundlings(data);
        }).finally(() => {
            dispatch(loadingOff());
        });
    }, [query, page, pageSize, dispatch, t]);

    return (
        <>
            <Typography variant="h2">{t("Search results") + ": " + query}</Typography>
            <List>
                {foundlings.map((row : Foundling) => (
                    <ListItem key={row.title}>
                        <Link to={getFoundlingPath(row.type) + encodeURIComponent(row.title)}>
                            <ListItemText
                                primary={row.title}
                                secondary={row.content}
                                primaryTypographyProps={{
                                    style: {
                                        whiteSpace: "normal",
                                        wordBreak: "break-word",
                                    }
                                }}
                                secondaryTypographyProps={{
                                    style: {
                                        whiteSpace: "normal",
                                        wordBreak: "break-word",
                                    }
                                }}
                            />
                            {row.type === FoundlingType.upload && (
                                <Avatar
                                    src={import.meta.env.VITE_API + '/file/get/' + encodeURIComponent(row.title)}
                                    alt={row.title}
                                    variant="square"
                                    sx={{
                                        width: 100,
                                        height: 100,
                                        objectFit: 'cover',
                                    }}
                                />
                            )}
                        </Link>
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
            <Typography hidden={foundlings.length != 0}>{t("No results found. You can create the page: ")}<Link to={"/page/" + encodeURIComponent(query)}>{query}</Link></Typography>
        </>
    );
}
