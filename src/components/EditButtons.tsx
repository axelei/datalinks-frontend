import {ReactNode, useState} from "react";
import {
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Fab,
    Tooltip,
    useMediaQuery
} from "@mui/material";
import {PageMode} from "../model/page/PageMode.ts";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import {t} from "i18next";
import Button from "@mui/material/Button";

interface Props {
    editPageEvent: () => void;
    savePageEvent: () => void;
    cancelEditionEvent: () => void;
    handleConfirmDelete: () => void;
    canEdit: boolean;
    canDelete: boolean;
    mode: PageMode
    children?: ReactNode;
}


export default function EditButtons( props : Props) : ReactNode | null {

    const [isHovered, setIsHovered] = useState(false);
    const isMobile = useMediaQuery('(max-width:600px)');
    const [openDialog, setOpenDialog] = useState(false);

    const handleDeleteClick = () => setOpenDialog(true);
    const handleCloseDialog = () => setOpenDialog(false);
    const handleConfirmDelete = () => {
        props.handleConfirmDelete();
        setOpenDialog(false);
    }

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    return (
        <>
            <Box
                sx={{
                    position: 'fixed',
                    top: 100,
                    right: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    opacity: isMobile || isHovered ? 1 : 0.5,
                    transition: 'opacity 0.3s ease',
                    zIndex: 1300,
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {props.mode === PageMode.read && (
                    <>
                        <Tooltip title={t("Edit")} placement="left">
                            <span><Fab color="primary" aria-label={t("Edit")} onClick={props.editPageEvent} disabled={!props.canEdit}>
                                <EditIcon />
                            </Fab></span>
                        </Tooltip>
                        <Tooltip title={t("Delete")} placement="left">
                            <span><Fab color="error" aria-label={t("Delete")} onClick={handleDeleteClick} disabled={!props.canDelete}>
                                <DeleteIcon/>
                            </Fab></span>
                        </Tooltip>
                    </>)}
                {props.mode === PageMode.edit && (
                    <>
                        <Tooltip title={t("Save")} placement="left">
                            <span><Fab color="primary" aria-label={t("Save")} onClick={props.savePageEvent}>
                                <SaveIcon/>
                            </Fab></span>
                        </Tooltip>
                        <Tooltip title={t("Cancel")} placement="left">
                            <span><Fab color="warning" aria-label={t("Cancel")} onClick={props.cancelEditionEvent}>
                                <CancelIcon/>
                            </Fab></span>
                        </Tooltip>
                    </>)}
                    {props.children}
            </Box>
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
            >
                <DialogTitle>{t("Confirm deletion")}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {t("Are you sure you want to delete this? This action can't be undone.")}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        {t("Cancel")}
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error" autoFocus>
                        {t("Confirm")}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );

}