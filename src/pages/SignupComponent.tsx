import {ReactNode, useState} from 'react';
import '../css/SignupComponent.css';
import {SubmitHandler, useForm} from "react-hook-form";
import {loadingOff, loadingOn} from "../redux/loadingSlice.ts";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    TextField
} from "@mui/material";
import Button from "@mui/material/Button";
import {useDispatch} from "react-redux";
import Typography from "@mui/material/Typography";
import {useTranslation} from "react-i18next";
import CheckIcon from '@mui/icons-material/Check';
import ReCAPTCHA from "react-google-recaptcha";


export default function SignUp() : ReactNode | null {

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [validationError, setValidationError] = useState<string>('');
    const [sucessOpen, setSucessOpen] = useState<boolean>(false);
    const [gray, setGray] = useState<boolean>(false);
    const [captcha, setCaptcha] = useState<string | null>(null);

    type Inputs = {
        username: string,
        password: string,
        passwordAgain: string,
        email: string,
        name?: string,
        captcha?: string,
    }

    const signup = async (inputs : Inputs) : Promise<string> => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({...inputs, captcha: captcha, language: navigator.language }),
        };
        const data = await fetch(import.meta.env.VITE_API + '/user/signup', requestOptions);
        if (data.ok) {
            return data.text();
        } else {
            return Promise.reject(data.text());
        }
    }

    const validateForm = (inputs : Inputs) : Promise<string> => {
        if (!captcha) {
            return Promise.reject(t("Captcha is required"));
        }
        if (inputs.password !== inputs.passwordAgain) {
            return Promise.reject(t("Passwords do not match"));
        }
        return Promise.resolve('');
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>()
    const onSubmit : SubmitHandler<Inputs> = (inputs : Inputs) : void => {
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
        result.then((_data: string) : void => {
            setGray(true);
            setSucessOpen(true);
        }).catch((error : Promise<string>) : void => {
            error.then((data: string) : void => {
                switch (data) {
                    case 'USER_EXISTS':
                        setValidationError(t("Username already exists"));
                        break;
                    default:
                        setValidationError(t("Unknown error"));
                        break;
                }
            });
        }).finally(() : void => {
            dispatch(loadingOff());
        });
    }

    const onChangeCaptcha = (value : string | null) => {
        setCaptcha(value);
    }

    const handleSucessClose = () => {
        setSucessOpen(false);
    }

    const usernamePattern = /^[A-Za-z0-9]{3,20}$/i;
    const emailPattern = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

    return (
        <>
            <Dialog
                open={sucessOpen}
                onClose={handleSucessClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {t("User created")}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <CheckIcon color="success" /> {t("User created successfully. Please check your email to confirm it.")}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSucessClose} autoFocus>{t("OK")}</Button>
                </DialogActions>
            </Dialog>
            <div className="signup-form">
                <Typography variant="h2">{t("Sign up")}</Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormControl>
                        <TextField label={t("Username")} variant="outlined" disabled={gray}
                                   {...register("username", {required: true, pattern: usernamePattern })}
                                   helperText={errors.username && t("Username must be alphanumeric and between 3 and 20 characters")}
                                   error={!!errors.username}
                        />
                    </FormControl>
                    <FormControl>
                        <TextField label={t("Password")} variant="outlined" type="password" disabled={gray}
                                   {...register("password", {required: true, min: 8 })}
                                   helperText={errors.password && t("Password must be 8 character minimum")}
                                   error={!!errors.password}
                        />
                    </FormControl>
                    <FormControl>
                        <TextField label={t("Password confirmation")} variant="outlined" type="password" disabled={gray}
                                   {...register("passwordAgain", {required: true })}
                                   helperText={errors.passwordAgain && t("Password confirmation is required")}
                                   error={!!errors.passwordAgain}
                        />
                    </FormControl>
                    <FormControl>
                        <TextField label={t("Email")} variant="outlined" disabled={gray}
                                   {...register("email", {required: true, pattern: emailPattern})}
                                   helperText={errors.email && t("Email seems not correct")}
                                   error={!!errors.email}
                        />
                    </FormControl>
                    <FormControl>
                        <TextField label={t("Name")} variant="outlined" disabled={gray}
                                   {...register("name")}
                                   helperText={errors.name && t("Name seems not correct")}
                                   error={!!errors.name}
                        />
                    </FormControl>
                    <FormControl>
                        <ReCAPTCHA {...register("captcha")}
                            sitekey="6Ld2MnUqAAAAAIEtHM3hx4e-DoouOJsViXLaGADX"
                            onChange={onChangeCaptcha}
                        />
                    </FormControl>
                    <Typography color="error">{validationError}</Typography>

                    <FormControl>
                        <Button variant='contained' type="submit" disabled={gray}>{t("Sign up")}</Button>
                    </FormControl>
                </form>
            </div>
        </>
    )
}


