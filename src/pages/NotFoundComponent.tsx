import {ReactNode} from "react";
import Typography from "@mui/material/Typography";
import {Link} from "react-router-dom";
import {t} from "i18next";

export default function NotFoundComponent(): ReactNode | null {
    return (
        <div>
            <Typography variant="h2" gutterBottom>{t("Page not found")}</Typography>
            <p>{t("The page you're looking for doesn't exist.")}</p>
            <Link to="/">{t("Go back to the front page")}</Link>
        </div>
    );
}
