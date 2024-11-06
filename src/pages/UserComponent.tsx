import {ReactNode, useEffect, useState} from 'react';
import {useLocation} from "react-router-dom";
import {useDispatch} from "react-redux";
import {newUser, User} from "../model/user/User.ts";
import {useTranslation} from "react-i18next";
import {fetchUser} from "../service/UserService.ts";
import Typography from "@mui/material/Typography";
import {log} from "../service/Common.ts";
import {useAppSelector} from "../hooks.ts";
import {UserLevel} from "../model/user/UserLevel.ts";
import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import {SubmitHandler, useForm} from "react-hook-form";
import {FormControl, TextField} from "@mui/material";
import {loadingOff, loadingOn} from "../redux/loadingSlice.ts";
import InfoDialog from "../components/InfoDialog.tsx";

export default function UserComponent() : ReactNode | null {

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const loggedUser = useAppSelector((state) => state.loggedUser);
    const location = useLocation();

    const [user, setUser] = useState<User>(newUser());
    const [changePasswordValidationError, setChangePasswordValidationError] = useState<string>('');
    const [canEdit, setCanEdit] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        log("UserComponent useEffect");
        const usernamePath = location.pathname.split('/')[2];

        fetchUser(usernamePath)
            .then((data : User) => {
                setUser({...data});
                document.title = import.meta.env.VITE_SITE_TITLE + ' - ' + data.username;

                setCanEdit(data.name === loggedUser.user.name || loggedUser.user.level === UserLevel.ADMIN);

            }).catch(() => {
                setUser({...newUser(), name: t("User not found")});
                document.title = import.meta.env.VITE_SITE_TITLE + ' - ' + t("User not found");
        });

    }, [dispatch, location.pathname, loggedUser.user.level, loggedUser.user.name, t]);

    const changePassword = async (inputs : ChangePasswordInputs) : Promise<string> => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'login-token': loggedUser.token },
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
            <InfoDialog show={showSuccess} onClose={() => setShowSuccess(false)} text={t("Password changed successfully")} />
            <Typography variant="h2">{t("User")}: {user.username}</Typography>
            <article className="passwordReset-form">
                {user.name}
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
                    <Button variant="contained" disabled={!canEdit} type="submit"><EditIcon/> {t("Save")}</Button>
                </form>
            </article>
                </>
                )
            }


