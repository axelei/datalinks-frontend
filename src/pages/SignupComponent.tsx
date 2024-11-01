import {ReactNode} from 'react';
import '../css/SignupComponent.css';
import {SubmitHandler, useForm} from "react-hook-form";
import {loadingOff, loadingOn} from "../redux/loadingSlice.ts";
import {FormControl, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import {useDispatch} from "react-redux";


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

    const usernamePattern = /^[A-Za-z0-9]+$/i;
    const emailPattern = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

    return (
        <>
            <div className="signup-form">
                <h2>Sign up</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormControl>
                        <TextField label="Username" variant="outlined"
                                   {...register("username", {required: true, pattern: usernamePattern})}
                                   helperText={errors.username && "Username is required"}
                                   error={!!errors.username}
                        />
                    </FormControl>
                    <FormControl>
                        <TextField label="Password" variant="outlined" type="password"
                                   {...register("password", {required: true })}
                                   helperText={errors.password && "Password confirmation is required"}
                                   error={!!errors.password}
                        />
                    </FormControl>
                    <FormControl>
                        <TextField label="Password confirmation" variant="outlined" type="password"
                                   {...register("passwordAgain", {required: true })}
                                   helperText={errors.passwordAgain && "Password confirmation is required"}
                                   error={!!errors.passwordAgain}
                        />
                    </FormControl>
                    <FormControl>
                        <TextField label="Email" variant="outlined"
                                   {...register("email", {required: true, pattern: emailPattern})}
                                   helperText={errors.email && "Email seems not correct"}
                                   error={!!errors.email}
                        />
                    </FormControl>

                    <FormControl>
                        <Button variant='contained' type="submit">Sign up</Button>
                    </FormControl>
                </form>
            </div>
        </>
    )
}


