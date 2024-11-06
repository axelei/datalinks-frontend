import {ReactNode} from "react";
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import Button from "@mui/material/Button";
import {t} from "i18next";

interface Props {
    show: boolean;
    onClose: () => void;
    text: string;
}

export default function InfoDialog(props: Props) : ReactNode | null {
    return (
        <>
            <Dialog
                open={props.show}
                onClose={props.onClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {t("User created")}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <CheckIcon color="success" />{props.text}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.onClose} autoFocus>{t("OK")}</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}