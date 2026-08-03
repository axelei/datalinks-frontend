import {ReactNode, useEffect, useState} from 'react';
import {useAppDispatch} from "../hooks.ts";
import {loadingOff, loadingOn} from "../redux/loadingSlice.ts";
import {useTranslation} from "react-i18next";
import Typography from "@mui/material/Typography";
import {log} from "../service/Common.ts";
import {activateUser} from "../service/UserService.ts";

export default function ActivateUserComponent() : ReactNode | null {

    const { t } = useTranslation();
    const [result, setResult] = useState<string>('');

    const dispatch = useAppDispatch();

    useEffect(() => {
        const activationToken = decodeURIComponent(window.location.pathname.split('/')[2] ?? '');
        dispatch(loadingOn());
        activateUser(activationToken)
            .then((data : string) => {
                log("Activation success: " + data);
                setResult(t("Success! Your user is now activated and you can proceed to log in."));
            }).catch((error) => {
                log("Activation failed: " + error);
                setResult(t("Activation failed."));
            }).finally(() => {
                dispatch(loadingOff());
            });

    }, [dispatch, t]);


    return (
        <>
            <Typography variant="h2">{t("User activation.")}</Typography>
            <Typography>{result}</Typography>
        </>
    )
}


