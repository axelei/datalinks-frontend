import {ReactNode, useEffect, useState} from 'react';
import {useLocation} from "react-router-dom";
import {useDispatch} from "react-redux";
import {User} from "../model/user/User.ts";
import {useTranslation} from "react-i18next";
import {fetchUser} from "../service/UserService.ts";
import Typography from "@mui/material/Typography";


export default function UserComponent() : ReactNode | null {

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const location = useLocation();

    const [username, setUsername] = useState('');
    const [name, setName] = useState('');

    useEffect(() => {
        const usernamePath = location.pathname.split('/')[2];

        fetchUser(usernamePath)
            .then((data : User) => {
                setUsername(data.username);
                setName(data.name);
                document.title = import.meta.env.VITE_SITE_TITLE + ' - ' + data.username;
            }).catch(() => {
                setUsername(t("User not found"));
                setName('');
                document.title = import.meta.env.VITE_SITE_TITLE + ' - ' + t("User not found");
        });

    }, [dispatch, location.pathname, t]);


    return (
        <>
            <Typography variant="h2">{t("User")}: {username}</Typography>
            <p>
                {name}
            </p>
        </>
    )
}


