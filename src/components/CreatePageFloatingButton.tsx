import { ReactNode, useState } from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Fab,
    TextField,
    Button,
    Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function CreatePageFloatingButton(): ReactNode | null {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const [open, setOpen] = useState(false);
    const [pageName, setPageName] = useState("");

    const handleOpen = () => setOpen(true);

    const handleClose = () => {
        setOpen(false);
        setPageName("");
    };

    const handleCreate = () => {
        const name = pageName.trim();
        if (!name) return;
        handleClose();
        navigate(`/page/${encodeURIComponent(name)}`, {
            state: { ...location.state, openInEditMode: true },
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleCreate();
    };

    return (
        <>
            <Tooltip title={t("Create a new page")} placement="left">
                <span>
                    <Fab color="primary" aria-label={t("Create a new page")} onClick={handleOpen}>
                        <AddIcon />
                    </Fab>
                </span>
            </Tooltip>
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        overflow: "visible",
                        position: "relative",
                        "&::before": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 4,
                            bgcolor: "primary.main",
                            borderTopLeftRadius: 8,
                            borderTopRightRadius: 8,
                        },
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        pt: 4,
                        pb: 1,
                        fontWeight: 700,
                        letterSpacing: "-0.02em",
                        textAlign: "center",
                    }}
                >
                    {t("Create a new page")}
                </DialogTitle>
                <DialogContent sx={{ px: 4, pb: 1 }}>
                    <TextField
                        autoFocus
                        fullWidth
                        variant="outlined"
                        label={t("Page name")}
                        placeholder={t("Enter page title")}
                        value={pageName}
                        onChange={(e) => setPageName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        slotProps={{
                            input: {
                                sx: {
                                    borderRadius: 1.5,
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                        borderWidth: 2,
                                    },
                                },
                            },
                        }}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 4, pb: 3, justifyContent: "center", gap: 2 }}>
                    <Button onClick={handleClose} color="inherit" sx={{ minWidth: 100 }}>
                        {t("Cancel")}
                    </Button>
                    <Button
                        onClick={handleCreate}
                        variant="contained"
                        disabled={!pageName.trim()}
                        sx={{ minWidth: 120, fontWeight: 600 }}
                    >
                        {t("Create")}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
