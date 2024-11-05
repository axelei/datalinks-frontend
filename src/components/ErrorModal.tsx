import {ReactNode} from "react";
import {Box, Modal} from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {modalStyle} from "../service/Common.ts";
import {useDispatch} from "react-redux";
import {hideError} from "../redux/showErrorSlice.ts";
import ErrorIcon from '@mui/icons-material/Error';
import {useTranslation} from "react-i18next";

export default function ErrorModal(props: { show: boolean }) : ReactNode | null {

    const { t } = useTranslation();
    const dispatch = useDispatch();

    return (
        <>
            <Modal
                aria-labelledby="unstyled-modal-title"
                aria-describedby="unstyled-modal-description"
                open={props.show}
            >
                <Box sx={modalStyle}>
                    <ErrorIcon />
                    <Typography variant="h2">{t("Something went wrong...")}</Typography>
                    <Typography>
                        {t("Either the server failed to process the request or you don't have permissions to perform the requested action.")}
                    </Typography>
                    <Button onClick={() => dispatch(hideError())}>OK</Button>
                </Box>
            </Modal>
        </>
    );

}