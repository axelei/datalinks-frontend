import {ReactNode, useEffect, useState} from 'react';
import {useDispatch} from "react-redux";
import {useTranslation} from "react-i18next";
import Typography from "@mui/material/Typography";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    TextField
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import Button from "@mui/material/Button";
import ReCAPTCHA from "react-google-recaptcha";
import {SubmitHandler, useForm} from "react-hook-form";

export default function ResetPasswordRequestComponent() : ReactNode | null {

    const { t } = useTranslation();
    const [validationError, setValidationError] = useState<string>('');
    const [sucessOpen, setSucessOpen] = useState<boolean>(false);
    const [gray, setGray] = useState<boolean>(false);
    const [captcha, setCaptcha] = useState<string | null>(null);
    const dispatch = useDispatch();

    type Inputs = {
        username: string,
        email: string,
        captcha?: string,
    }

    useEffect(() => {

    }, [dispatch, t]);

    const sendPasswordResetRequest = async (inputs : Inputs) : Promise<string> => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({...inputs, captcha: captcha }),
        };
        const data = await fetch(import.meta.env.VITE_API + '/user/requestReset', requestOptions);
        if (data.ok) {
            return data.text();
        } else {
            return Promise.reject(data.text());
        }
    }

    const validateForm = (_inputs : Inputs) : Promise<string> => {
        if (!captcha) {
            return Promise.reject(t("Captcha is required"));
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
                const request = sendPasswordResetRequest(inputs);
                request.then(() => {
                    setSucessOpen(true);
                    setGray(true);
                }).catch((_error) => {
                    setValidationError(t("Password already in reset process or user not found."));
                });
            }).catch((error) => {
            setValidationError(error);
        });
    }


    const onChangeCaptcha = (value : string | null) => {
        setCaptcha(value);
    }

    const handleSucessClose = () => {
        setSucessOpen(false);
    }

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
                    {t("Password reset")}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <CheckIcon
                            color="success"/> {t("Password has been successfully reset. Check your email for details.")}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSucessClose} autoFocus>{t("OK")}</Button>
                </DialogActions>
            </Dialog>
            <Typography variant="h2">{t("Password reset request.")}</Typography>
            <div className="passwordReset-form">
                <Typography>{t("If you lost your password you can request a reset.")}</Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormControl>
                        <TextField label={t("Username")} variant="outlined" disabled={gray}
                                   {...register("username", {required: true})}
                                   helperText={errors.username && t("Username is required")}
                                   error={!!errors.username}
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
                        <ReCAPTCHA {...register("captcha")}
                                   sitekey="6Ld2MnUqAAAAAIEtHM3hx4e-DoouOJsViXLaGADX"
                                   onChange={onChangeCaptcha}
                        />
                    </FormControl>
                    <Typography color="error">{validationError}</Typography>

                    <FormControl>
                        <Button variant='contained' type="submit" disabled={gray}>{t("Request password reset")}</Button>
                    </FormControl>
                </form>
            </div>
        </>
    )
}


