import {ReactNode, useEffect, useState} from 'react';
import {useLocation} from "react-router-dom";
import {useDispatch} from "react-redux";
import {newUser, User} from "../model/user/User.ts";
import {useTranslation} from "react-i18next";
import {fetchUser} from "../service/UserService.ts";
import Typography from "@mui/material/Typography";
import {log} from "../service/Common.ts";
import {useAppSelector} from "../hooks.ts";
import ChangePasswordComponent from "../components/ChangePasswordComponent.tsx";
import {UserLevel} from "../model/user/UserLevel.ts";

export default function UserComponent() : ReactNode | null {

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const loggedUser = useAppSelector((state) => state.loggedUser);
    const location = useLocation();
    const [user, setUser] = useState<User>(newUser());
    const [canEdit, setCanEdit] = useState<boolean>(false);

    useEffect(() => {
        log("UserComponent useEffect");
        const usernamePath = location.pathname.split('/')[2];

        fetchUser(usernamePath)
            .then((data : User) => {
                setUser({...data});
                document.title = import.meta.env.VITE_SITE_TITLE + ' - ' + data.username;
                if (data.username == loggedUser.user.username || loggedUser.user.level === UserLevel.ADMIN) {
                    setCanEdit(true);
                }
            }).catch(() => {
                setUser({...newUser(), name: t("User not found")});
                document.title = import.meta.env.VITE_SITE_TITLE + ' - ' + t("User not found");
        });

    }, [dispatch, location.pathname, loggedUser.user.level, loggedUser.user.name, loggedUser.user.username, t]);

    return (
        <>
            <Typography variant="h2">{t("User")}: {user.username}</Typography>
            <article>
                {user.name}
                <ChangePasswordComponent canEdit={canEdit} />
            </article>
        </>
    );
}


