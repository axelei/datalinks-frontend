import {ReactNode, useEffect, useState} from 'react';
import {useDispatch} from "react-redux";
import {loadingOff, loadingOn} from "../redux/loadingSlice.ts";
import {useTranslation} from "react-i18next";
import Typography from "@mui/material/Typography";

export default function ResetPasswordComponent() : ReactNode | null {

    const { t } = useTranslation();
    const [result, setResult] = useState<string>('');

    const resetPassword = async (resetToken : string) : Promise<string> => {
        const data = await fetch(import.meta.env.VITE_API + '/user/' + resetToken + "/reset");
        if (data.ok) {
            return data.text();
        } else {
            return Promise.reject('');
        }
    }

    const dispatch = useDispatch();

    useEffect(() => {
        const resetToken = window.location.pathname.split('/')[2];
        dispatch(loadingOn());
        resetPassword(resetToken)
            .then((_data : string) => {
                setResult(t("Success! Your password has been reset. Check your email for details."));
            }).catch(() => {
                setResult(t("Reset failed."));
            }).finally(() => {
                dispatch(loadingOff());
            });

    }, [dispatch, t]);


    return (
        <>
            <Typography variant="h2">{t("Password reset.")}</Typography>
            <Typography>{result}</Typography>
        </>
    )
}


