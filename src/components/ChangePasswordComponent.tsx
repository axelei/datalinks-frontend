import {ReactNode, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";
import {useAppSelector} from "../hooks.ts";
import {log} from "../service/Common.ts";
import {loadingOff, loadingOn} from "../redux/loadingSlice.ts";
import {SubmitHandler, useForm} from "react-hook-form";
import InfoDialog from "./InfoDialog.tsx";
import Typography from "@mui/material/Typography";
import {Box, FormControl, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import {User} from "../model/user/User.ts";

interface Props {
    user : User;
}

export default function ChangeUserComponent( props : Props) : ReactNode | null {

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const loggedUser = useAppSelector((state) => state.loggedUser);

    const [changePasswordValidationError, setChangePasswordValidationError] = useState<string>('');
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        log("ChangeUserComponent useEffect");

    }, [loggedUser.user.level, loggedUser.user.username, props.user.username]);

    const changePassword = async (inputs : ChangePasswordInputs) : Promise<string> => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + loggedUser.token
            },
            body: inputs.password,
        };
        const data = await fetch(import.meta.env.VITE_API + '/user/passwordChange', requestOptions);
        if (data.ok) {
            return data.text();
        } else {
            return Promise.reject(data.text());
        }
    }

    const sendPasswordChange = (inputs : ChangePasswordInputs) : void => {
        dispatch(loadingOn());
        const result = changePassword(inputs);
        result.then((data: string) : void => {
            log("Signup success: " + data);
            setShowSuccess(true);
        }).catch((error : Promise<string>) : void => {
            error.then((data: string) : void => {
                log("Password change error: " + data);
                setChangePasswordValidationError(t("Unknown error"));
            });
        }).finally(() : void => {
            dispatch(loadingOff());
        });
    }

    type ChangePasswordInputs = {
        password: string,
        passwordAgain: string,
    }

    const validateForm = (inputs : ChangePasswordInputs) : Promise<string> => {
        if (inputs.password !== inputs.passwordAgain) {
            return Promise.reject(t("Passwords do not match"));
        }
        return Promise.resolve('');
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ChangePasswordInputs>()
    const onSubmit : SubmitHandler<ChangePasswordInputs> = (inputs : ChangePasswordInputs) : void => {
        setChangePasswordValidationError('');
        validateForm(inputs)
            .then(() => {
                sendPasswordChange(inputs);
            }).catch((error) => {
            setChangePasswordValidationError(error);
        });
    }

    return (
        <>
            <Typography variant={"h3"}>{t("Change password")}</Typography>
            <InfoDialog show={showSuccess} onClose={() => setShowSuccess(false)} text={t("Password changed successfully")} />
            <Box className="passwordReset-form" component="section" sx={{ p: 2, border: '1px dashed grey' }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormControl>
                        <TextField label={t("Password")} variant="outlined" type="password"
                                   {...register("password", {required: true, min: 8})}
                                   helperText={errors.password && t("Password must be 8 character minimum")}
                                   error={!!errors.password}
                        />
                    </FormControl>
                    <FormControl>
                        <TextField label={t("Password confirmation")} variant="outlined" type="password"
                                   {...register("passwordAgain", {required: true})}
                                   helperText={errors.passwordAgain && t("Password confirmation is required")}
                                   error={!!errors.passwordAgain}
                        />
                    </FormControl>
                    <Typography color="error">{changePasswordValidationError}</Typography>
                    <Button variant="contained" type="submit"><EditIcon/> {t("Save")}</Button>
                </form>
            </Box>
        </>
    );

}