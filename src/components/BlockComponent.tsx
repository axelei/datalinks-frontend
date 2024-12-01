import {ReactNode, useEffect, useState} from "react";
import {Box, FormControl, InputLabel, MenuItem, Modal, Select, Stack, Typography} from "@mui/material";
import Button from "@mui/material/Button";
import {t} from "i18next";
import {UserLevel} from "../model/user/UserLevel.ts";
import {Page} from "../model/page/Page.ts";

interface Props {
    open: boolean;
    onClose: () => void;
    handleAccept: (readLevel : string, writeLevel : string) => void;
    page: Page;
}

export default function BlockComponent(props : Props): ReactNode | null {

    const [readLevel, setReadLevel] = useState('');
    const [writeLevel, setWriteLevel] = useState('');

    const handleAccept = () => {
        props.handleAccept(readLevel, writeLevel);
    }

    useEffect(() => {
        setReadLevel(props.page.readBlock ? UserLevel[props.page.readBlock] : '');
        setWriteLevel(props.page.editBlock ? UserLevel[props.page.editBlock] : '');
    }, [props.page.readBlock, props.page.editBlock]);

    return (
        <>
        <Modal open={props.open}>
        <Box
            sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
                borderRadius: 2,
            }}
        >
            <Typography variant="h6" component="h2" mb={2}>
                {t("Block page")}
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="first-select-label">{t("Read block")}</InputLabel>
                <Select
                    labelId="first-select-label"
                    value={readLevel}
                    onChange={(event) => setReadLevel(event.target.value)}
                    label={t("Read block")}
                >
                    <MenuItem value="">&nbsp;</MenuItem>
                    {Object.values(UserLevel)
                        .filter(value => typeof value === 'number')
                        .map((level) => (
                        <MenuItem value={level}>{UserLevel[level]}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel id="second-select-label">{t("Write block")}</InputLabel>
                <Select
                    labelId="second-select-label"
                    value={writeLevel}
                    onChange={(event) => setWriteLevel(event.target.value)}
                    label={t("Edit block")}
                >
                    <MenuItem value="">&nbsp;</MenuItem>
                    {Object.values(UserLevel)
                        .filter(value => typeof value === 'number')
                        .map((level) => (
                            <MenuItem value={level}>{UserLevel[level]}</MenuItem>
                        ))}
                </Select>
            </FormControl>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleAccept}
                >
                    {t("Block")}
                </Button>
                <Button
                    color="primary"
                    fullWidth
                    onClick={props.onClose}
                >
                    {t("Cancel")}
                </Button>
            </Stack>
        </Box>
    </Modal>
    </>);
}