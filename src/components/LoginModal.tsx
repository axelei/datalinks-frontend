import {ReactNode} from "react";
import {Box, Modal, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {modalStyle} from "../service/Common.ts";
import {SubmitHandler, useForm, useFormState} from "react-hook-form";

export default function LoginModal(props: { show: boolean, onClose: () => void }) : ReactNode | null {

    const handleClose = () => {
        props.onClose();
    }

    type Inputs = {
        username: string
        password: string
    }

    const login = async (username : string, password: string) : void => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({username, password}),
        };
        const data = await fetch(import.meta.env.VITE_API + '/user/login', requestOptions);
        if (data.ok) {
            console.log('Login successful');
        } else {
            console.log('Login NOT successful');
        }
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>()
    const onSubmit: SubmitHandler<Inputs> = (inputs : Inputs) => {
        login(inputs.username, inputs.password);
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
                    <form onSubmit={handleSubmit(onSubmit)}>

                        <TextField id="usernameField" label="Username" variant="outlined" {...register("username", { required: true })} /><br/>
                        {errors.username && <span>Username is required<br/></span>}
                        <TextField id="passwordField" label="Password" variant="outlined" {...register("password", { required: true })} /><br/>
                        {errors.password && <span>Password is required<br /></span>}
                        <div>
                            <Button variant='contained' type="submit">Login</Button>
                            <Button variant='contained' onClick={handleClose}>Cancel</Button>
                        </div>
                    </form>
                </Box>
            </Modal>
        </>
);

}