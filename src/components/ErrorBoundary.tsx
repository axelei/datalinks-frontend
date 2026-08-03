import {ReactNode} from "react";
import {isRouteErrorResponse, Link, useRouteError} from "react-router-dom";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {Box} from "@mui/material";
import {t} from "i18next";
import {log} from "../service/Common.ts";

export default function ErrorBoundary(): ReactNode | null {
    const error = useRouteError();

    const message = isRouteErrorResponse(error)
        ? `${error.status} ${error.statusText}`
        : error instanceof Error
            ? error.message
            : String(error);

    log("Unhandled application error: " + message);

    return (
        <Box sx={{textAlign: "center", marginTop: 10}}>
            <Typography variant="h2" gutterBottom>{t("Something went wrong...")}</Typography>
            <Typography color="error" gutterBottom>{message}</Typography>
            <Button component={Link} to="/" variant="contained" sx={{marginTop: 2}}>
                {t("Go back to the front page")}
            </Button>
        </Box>
    );
}
