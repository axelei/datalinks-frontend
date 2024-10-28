import {ReactNode} from "react";
import {Box, Modal} from "@mui/material";
import {ClipLoader} from "react-spinners";

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
                    <ClipLoader
                        color='#000000'
                        loading={props.loading}
                        size={150}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    />
                    <br />
                    Loading...
                </Box>
            </Modal>
        </>
    );

}