import {ReactNode, useEffect, useState} from 'react';
import {useDispatch} from "react-redux";
import {loadingOff, loadingOn} from "../redux/loadingSlice.ts";
import {useTranslation} from "react-i18next";
import Typography from "@mui/material/Typography";

export default function PageComponent() : ReactNode | null {

    const { t } = useTranslation();
    const [result, setResult] = useState<string>('');

    const activateUser = async (activationToken : string) : Promise<string> => {
        const data = await fetch(import.meta.env.VITE_API + '/user/' + activationToken + '/activate');
        if (data.ok) {
            return data.text();
        } else {
            return Promise.reject('');
        }
    }

    const dispatch = useDispatch();

    useEffect(() => {
        const activationToken = window.location.pathname.split('/')[2];
        dispatch(loadingOn());
        activateUser(activationToken)
            .then((_data : string) => {
                setResult(t("Sucess! Your user is now activated and you can proceedo to log in."));
            }).catch(() => {
                setResult(t("Activation failed."));
            }).finally(() => {
                dispatch(loadingOff());
            });

    }, [dispatch]);


    return (
        <>
            <Typography variant="h2">{t("User activation.")}</Typography>
            <Typography>{result}</Typography>
        </>
    )
}


