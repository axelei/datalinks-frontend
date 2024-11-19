import React, {ChangeEvent, ReactNode, useEffect, useState} from "react";
import {Category, newCategory} from "../model/page/Category.ts";
import {useTranslation} from "react-i18next";
import {formatDate, log} from "../service/Common.ts";
import {useDispatch} from "react-redux";
import {loadingOff, loadingOn} from "../redux/loadingSlice.ts";
import Typography from "@mui/material/Typography";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Fab,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Tooltip
} from "@mui/material";
import {Link} from "react-router-dom";
import Button from "@mui/material/Button";
import DeleteIcon from '@mui/icons-material/Delete';
import {addCategory, deleteCategory, fetchCategories} from "../service/CategoryService.ts";
import Box from "@mui/material/Box";
import AddIcon from '@mui/icons-material/Add';
import {useAppSelector} from "../hooks.ts";
import {UserLevel} from "../model/user/UserLevel.ts";

export default function CategoriesComponent(): ReactNode | null {

    const dispatch = useDispatch();
    const {t} = useTranslation();
    const [categories, setCategories] = useState<Category[]>([]);
    const [categoryName, setCategoryName] = useState('');
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [addCategoryOpen, setAddCategoryOpen] = useState(false);
    const [deleteCategoryOpen, setDeleteCategoryOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const loggedUser = useAppSelector((state) => state.loggedUser);

    const searchCategories = () => {
        dispatch(loadingOn());
        const result = fetchCategories(page, pageSize);
        result.then((categories) => {
            setCategories(categories);
        }).catch((error) => {
            log("Error fetching categories: " + error);
        }).finally(() => {
            dispatch(loadingOff());
        });
    }

    useEffect(() => {
        searchCategories();
    }, [page, pageSize]);

    useEffect(() => {
        setIsAdmin(UserLevel[loggedUser.user.level].toString() == UserLevel.ADMIN.toString());
    }, [loggedUser]);

    const handleChangePage = (_event: unknown, newPage: number) : void => {
        setPage(newPage);
    }

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) : void => {
        setPageSize(parseInt(event.target.value, 10));
    }

    const handleDelete = () => {
        dispatch(loadingOn());
        const result = deleteCategory(categoryName, loggedUser.token);
        result.then(() => {
            searchCategories();
        }).catch((error) => {
            log("Error while deleting category: " + error);
        }).finally(() => {
            dispatch(loadingOff());
            setCategoryName('');
            setDeleteCategoryOpen(false);
        });
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCategoryName(event.target.value);
    }

    const handleSave = () => {
        if (categoryName) {
            dispatch(loadingOn());
            const result = addCategory(categoryName, loggedUser.token);
            result.then(() => {
                searchCategories();
                setCategoryName('');
            }).catch((error) => {
                log("Error while adding category: " + error);
            }).finally(() => {
                setAddCategoryOpen(false);
                setCategoryName('')
                dispatch(loadingOff());
            });
        }
    }

    const openDeleteCategory = (name: string) => {
        setCategoryName(name);
        setDeleteCategoryOpen(true);
    }

    return (
        <>
            <Typography variant="h2">{t("Categories")}</Typography>
            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>{t("Name")}</TableCell>
                            <TableCell align="right">{t("Creation date")}</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categories.map((row : Category) => (
                            <TableRow
                                key={row.name}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row" style={{whiteSpace: "normal", wordBreak: "break-word"}}>
                                    <Link to={'/category/' + row.name}>{row.name}</Link>
                                </TableCell>
                                <TableCell align="right">{formatDate(row.creationDate)}</TableCell>
                                <TableCell align="right">
                                    <Button hidden={!isAdmin} color="error" onClick={() => openDeleteCategory(row.name)}><DeleteIcon/></Button>
                                </TableCell>
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
            <Dialog open={addCategoryOpen} onClose={() => {setAddCategoryOpen(false)}}>
                <DialogTitle>{t("Add category")}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label={t("Name")}
                        name="name"
                        value={categoryName}
                        onChange={handleChange}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {setAddCategoryOpen(false)}}>{t("Cancel")}</Button>
                    <Button onClick={handleSave} variant="contained" color="primary">
                        {t("Add")}
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={deleteCategoryOpen} onClose={() => {setDeleteCategoryOpen(false)}}>
                <DialogTitle>{t("Delete category")}</DialogTitle>
                <DialogContent>
                    <Typography>{t("Are you sure you want to delete the category")} <b>{categoryName}</b>?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {setDeleteCategoryOpen(false)}}>{t("Cancel")}</Button>
                    <Button onClick={handleDelete} variant="contained" color="error">
                        {t("Delete")}
                    </Button>
                </DialogActions>
            </Dialog>
            <Box
                sx={{
                    position: 'fixed',
                    top: 100,
                    right: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    zIndex: 1300,
                }}
            >
                <Tooltip title={t("Add category")} placement="left">
                    <span><Fab color="primary" aria-label={t("Add category")} disabled={!isAdmin} onClick={() => setAddCategoryOpen(true)}>
                        <AddIcon/>
                    </Fab></span>
                </Tooltip>
            </Box>
        </>
    );
}