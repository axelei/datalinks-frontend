import {ReactNode} from "react";
import {Box, Modal, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {modalStyle} from "../service/Common.ts";
import {SubmitHandler, useForm} from "react-hook-form";
import {loadingOff, loadingOn} from "../redux/loadingSlice.ts";
import {useDispatch} from "react-redux";
import {Link} from "react-router-dom";

export default function LoginModal(props: { show: boolean, onClose: () => void }) : ReactNode | null {

    const handleClose = () => {
        props.onClose();
    }

    const dispatch = useDispatch();

    type Inputs = {
        username: string
        password: string
    }

    const login = async (username : string, password: string) : Promise<void> => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({username, password}),
        };
        const data = await fetch(import.meta.env.VITE_API + '/user/login', requestOptions);
        if (data.ok) {
            console.log('Login successful');
            return data.json();
        } else {
            return Promise.reject('Login failed');
        }
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>()
    const onSubmit: SubmitHandler<Inputs> = (inputs : Inputs) => {
        dispatch(loadingOn());
        const result = login(inputs.username, inputs.password);
        result.then((data) => {
            console.log(data)
        }).catch((error) => {
            console.log(error);
        }).finally(() => {
            dispatch(loadingOff());
        });
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
                    <Typography>Log in</Typography>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <TextField label="Username" variant="outlined" {...register("username", { required: true })} /><br/>
                        {errors.username && <Typography>Username is required<br/></Typography>}
                        <TextField label="Password" variant="outlined" {...register("password", { required: true })} /><br/>
                        {errors.password && <Typography>Password is required<br /></Typography>}
                        <div>
                            <Button variant='contained' type="submit">Login</Button>
                            <Button variant='contained' onClick={handleClose}>Cancel</Button>
                        </div>
                        <p>Don't have an account? <Link to='/signup' onClick={props.onClose}>Sign up</Link></p>
                    </form>
                </Box>
            </Modal>
        </>
);

}