import {ReactNode, useEffect, useState} from 'react';
import {useLocation} from "react-router-dom";
import {useDispatch} from "react-redux";
import {User} from "../model/user/User.ts";
import {useTranslation} from "react-i18next";
import {fetchUser} from "../service/UserService.ts";


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
            <h1>{t("User")}: {username}</h1>
            <p>
                {name}
            </p>
        </>
    )
}


