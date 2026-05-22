import {ChangeEvent, useState} from "react";

export interface PaginationState {
    page: number;
    pageSize: number;
}

export function usePagination(defaultPageSize = 10) {
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(defaultPageSize);

    const handleChangePage = (_event: unknown, newPage: number): void => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>): void => {
        setPageSize(parseInt(event.target.value, 10));
        setPage(0);
    };

    return { page, pageSize, handleChangePage, handleChangeRowsPerPage };
}
