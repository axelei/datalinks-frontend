import {ReactNode} from "react";
import {Box, FormControl, Modal, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {modalStyle} from "../service/Common.ts";

export default function LoginModal(props: { show: boolean, onClose: () => void }) : ReactNode | null {

    const validateInputs = () => {
        const username = document.getElementById('usernameField') as HTMLInputElement;
        const password = document.getElementById('passwordField') as HTMLInputElement;
        console.log(username);
        console.log(password);
    }

    const handleClose = () => {
        props.onClose();
    }

    const handleLogin = () => {
        validateInputs();
        //console.log('Login with username: ' + username + ' and password: ' + password);
    }

    return (
        <>
            <Modal
                aria-labelledby="unstyled-modal-title"
                aria-describedby="unstyled-modal-description"
                open={props.show}
                onClose={handleClose}
            >
                <Box sx={modalStyle}>
                    <Typography>
                        Login
                    </Typography>
                    <FormControl id="loginFormControl">
                            <TextField id="usernameField" label="Username" variant="outlined" />
                            <TextField id="passwordField" label="Password" variant="outlined" type="password" />
                            <Button variant='contained' onClick={handleLogin}>Login</Button>
                            <Button variant='contained' onClick={handleClose}>Cancel</Button>
                    </FormControl>
                </Box>
            </Modal>
        </>
    );

}