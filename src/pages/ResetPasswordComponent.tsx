import {ReactNode, useEffect, useState} from 'react';
import {useAppDispatch} from "../hooks.ts";
import {loadingOff, loadingOn} from "../redux/loadingSlice.ts";
import {useTranslation} from "react-i18next";
import Typography from "@mui/material/Typography";
import {log} from "../service/Common.ts";
import {resetPassword} from "../service/UserService.ts";

export default function ResetPasswordComponent() : ReactNode | null {

    const { t } = useTranslation();
    const [result, setResult] = useState<string>('');

    const dispatch = useAppDispatch();

    useEffect(() => {
        const resetToken = decodeURIComponent(window.location.pathname.split('/')[2] ?? '');
        dispatch(loadingOn());
        resetPassword(resetToken)
            .then((data : string) => {
                log("Reset password success: " + data);
                setResult(t("Success! Your password has been reset. Check your email for details."));
            }).catch((error : string) => {
                log("Reset password failed: " + error);
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


