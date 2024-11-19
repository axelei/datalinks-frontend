import {ChangeEvent, ReactNode, useEffect, useState} from "react";
import {Category} from "../model/page/Category.ts";
import {useTranslation} from "react-i18next";
import {formatDate, log} from "../service/Common.ts";
import {useDispatch} from "react-redux";
import {loadingOff, loadingOn} from "../redux/loadingSlice.ts";
import Typography from "@mui/material/Typography";
import {
    Dialog,
    DialogActions, DialogContent, DialogTitle,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow, TextField
} from "@mui/material";
import {Link} from "react-router-dom";
import Button from "@mui/material/Button";
import DeleteIcon from '@mui/icons-material/Delete';
import {fetchCategories} from "../service/CategoryService.ts";

export default function CategoriesComponent(): ReactNode | null {

    const dispatch = useDispatch();
    const {t} = useTranslation();
    const [categories, setCategories] = useState<Category[]>([]);
    const [categoryName, setCategoryName] = useState('');
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [addCategoryOpen, setAddCategoryOpen] = useState(false);

    useEffect(() => {
        dispatch(loadingOn());
        fetchCategories(page, pageSize).then((categories) => {
            setCategories(categories);
        }).catch((error) => {
            log("Error fetching categories: " + error);
        }).finally(() => {
            dispatch(loadingOff());
        });
    }, []);

    const handleChangePage = (_event: unknown, newPage: number) : void => {
        setPage(newPage);
    }

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) : void => {
        setPageSize(parseInt(event.target.value, 10));
    }

    const deleteCategory = (name: string) => {

    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCategoryName(event.target.value);
    }

    const handleSave = () => {
        if (categoryName) {
            dispatch(loadingOn());
            const result = addCategory(categoryName);
            result.then((data: Category) => {
                setCategories([...categories, data]);
                setCategoryName('');
            }).catch((error) => {
                log("Error while adding category: " + error);
            }).finally(() => {
                setAddCategoryOpen(false);
                dispatch(loadingOff());
            });
        }
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
                                <TableCell align="right"><Button onClick={() => deleteCategory(row.name)}><DeleteIcon/></Button></TableCell>
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
        </>
    );
}