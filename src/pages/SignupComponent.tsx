import {ReactNode, useState} from 'react';
import '../css/SignupComponent.css';
import {SubmitHandler, useForm} from "react-hook-form";
import {loadingOff, loadingOn} from "../redux/loadingSlice.ts";
import {FormControl, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import {useDispatch} from "react-redux";
import Typography from "@mui/material/Typography";


export default function SignUp() : ReactNode | null {

    const dispatch = useDispatch();
    const [validationError, setValidationError] = useState<string>('');

    type Inputs = {
        username: string
        password: string
        passwordAgain: string
        email: string
        name?: string
    }

    const signup = async (inputs : Inputs) : Promise<string> => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({...inputs}),
        };
        const data = await fetch(import.meta.env.VITE_API + '/user/signup', requestOptions);
        if (data.ok) {
            console.log('Sign up successful');
            return data.text();
        } else {
            return Promise.reject(data.text());
        }
    }

    const validateForm = (inputs : Inputs) : Promise<string> => {
        if (inputs.password !== inputs.passwordAgain) {
            return Promise.reject('Passwords do not match');
        }
        return Promise.resolve('');
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>()
    const onSubmit: SubmitHandler<Inputs> = (inputs : Inputs) : void => {
        setValidationError('');
        validateForm(inputs)
            .then(() => {
                sendSignup(inputs);
            }).catch((error) => {
                setValidationError(error);
        });
    }

    const sendSignup = (inputs : Inputs) : void => {
        dispatch(loadingOn());
        const result = signup(inputs);
        result.then((data: string) : void => {
            //TODO USER CREATED
            console.log("Used created OK");
            console.log(data);
        }).catch((error : Promise<string>) : void => {
            error.then((data: string) : void => {
                setValidationError(data);
                console.log(data.length);
            });
        }).finally(() : void => {
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
                                   helperText={errors.username && "Username must be alphanumeric"}
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
                        <TextField label="Name" variant="outlined"
                                   {...register("name")}
                                   helperText={errors.name && "Name seems not correct"}
                                   error={!!errors.name}
                        />
                    </FormControl>
                    <FormControl>
                        <Typography color="error">{validationError}</Typography>
                    </FormControl>

                    <FormControl>
                        <Button variant='contained' type="submit">Sign up</Button>
                    </FormControl>
                </form>
            </div>
        </>
    )
}


