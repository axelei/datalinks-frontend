import {ReactNode} from "react";
import {Box, CircularProgress, Modal} from "@mui/material";
import Typography from "@mui/material/Typography";

export default function LoadingModal(props: { loading: boolean }) : ReactNode | null {

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        textAlign: 'center',
    };

    return (
        <>
            <Modal
                aria-labelledby="unstyled-modal-title"
                aria-describedby="unstyled-modal-description"
                open={props.loading}
            >
                <Box sx={style}>
                    <CircularProgress />
                    <Typography>
                        Loading...
                    </Typography>
                </Box>
            </Modal>
        </>
    );

}