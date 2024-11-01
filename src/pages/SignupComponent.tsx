import {ReactNode} from 'react';
import '../css/pagecomponent.css';
import {SubmitHandler, useForm} from "react-hook-form";
import {loadingOff, loadingOn} from "../redux/loadingSlice.ts";
import {TextField} from "@mui/material";
import Button from "@mui/material/Button";
import {useDispatch} from "react-redux";
import Typography from "@mui/material/Typography";


export default function SignUp() : ReactNode | null {

    const dispatch = useDispatch();

    type Inputs = {
        username: string
        password: string
        passwordAgain: string
        email: string
        name?: string
    }

    const signup = async (inputs : Inputs) : Promise<void> => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({...inputs}),
        };
        const data = await fetch(import.meta.env.VITE_API + '/user/signup', requestOptions);
        if (data.ok) {
            console.log('Sign up successful');
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
        const result = signup(inputs);
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
            <h1>Sign up</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField label="Username" variant="outlined" {...register("username", { required: true })} /><br/>
                {errors.username && <Typography>Username is required<br/></Typography>}
                <TextField label="Password" variant="outlined" {...register("password", { required: true })} /><br/>
                {errors.password && <Typography>Password is required<br /></Typography>}
                <TextField label="Password again" variant="outlined" {...register("passwordAgain", { required: true })} /><br/>
                {errors.passwordAgain && <Typography>Password again is required<br /></Typography>}
                <div>
                    <Button variant='contained' type="submit">Sign up</Button>
                </div>
            </form>
        </>
    )
}


