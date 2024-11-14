import {ReactNode} from "react";
import Typography from "@mui/material/Typography";
import {t} from "i18next";

export default function AboutComponent(): ReactNode | null {
  return (
    <div>
        <Typography variant="h2" gutterBottom>{t("About")}</Typography>
        <p>{t("Datalinks project -- by Krusher 2024")}</p>
    </div>
  );
}