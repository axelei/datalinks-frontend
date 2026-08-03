import {ReactNode} from "react";
import {TablePagination} from "@mui/material";
import {useTranslation} from "react-i18next";

interface Props {
    page: number;
    pageSize: number;
    itemCount: number;
    onPageChange: (event: unknown, newPage: number) => void;
    onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function AppTablePagination(props: Props): ReactNode {
    const { t } = useTranslation();
    const hasMore = props.itemCount >= props.pageSize;

    return (
        <TablePagination
            rowsPerPageOptions={[10, 20, 50, 100]}
            component="div"
            count={-1}
            rowsPerPage={props.pageSize}
            page={props.page}
            onPageChange={props.onPageChange}
            onRowsPerPageChange={props.onRowsPerPageChange}
            labelRowsPerPage={t("Rows per page:")}
            labelDisplayedRows={({ from }) => {
                if (props.itemCount === 0) {
                    return t("No results");
                }
                const to = from + props.itemCount - 1;
                return hasMore
                    ? t("{{from}}-{{to}} of more than {{to}}", { from, to })
                    : t("{{from}}-{{to}} of {{to}}", { from, to });
            }}
            slotProps={{
                actions: {
                    nextButton: {
                        disabled: !hasMore,
                    },
                },
            }}
        />
    );
}
