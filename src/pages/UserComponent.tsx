import {ReactNode, SyntheticEvent, useEffect, useState} from 'react';
import {newUser, User} from "../model/user/User.ts";
import {useTranslation} from "react-i18next";
import Typography from "@mui/material/Typography";
import {log} from "../service/Common.ts";
import ChangePasswordComponent from "../components/ChangePasswordComponent.tsx";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {Box} from "@mui/material";
import {CustomTabPanel} from "../components/layout/CustomTabPanel.tsx";
import {fetchUser} from "../service/UserService.ts";
import {isLevel, levelName, UserLevel} from "../model/user/UserLevel.ts";
import {useAppSelector} from "../hooks.ts";
import ContributionsComponent from "../components/ContributionsComponent.tsx";
import {useLocation} from "react-router-dom";


export default function UserComponent() : ReactNode | null {

    const { t } = useTranslation();
    const location = useLocation();
    const [user, setUser] = useState<User>(newUser());
    const [tab, setTab] = useState<number>(0);
    const [canEdit, setCanEdit] = useState<boolean>(false);
    const loggedUser = useAppSelector((state) => state.loggedUser);

    useEffect(() => {
        log("UserComponent useEffect");
        const usernamePath = decodeURIComponent(location.pathname.split('/')[2] ?? '');

        fetchUser(usernamePath)
            .then((data : User) => {
                setUser({...data});
                document.title = import.meta.env.VITE_SITE_TITLE + ' - ' + data.username;
                if (loggedUser.user.username === data.username || isLevel(loggedUser.user.level, UserLevel.ADMIN)) {
                    setCanEdit(true);
                }
            }).catch(() => {
            setUser({...newUser(), name: t("User not found")});
            document.title = import.meta.env.VITE_SITE_TITLE + ' - ' + t("User not found");
        });

    }, [location.pathname, loggedUser.user.level, loggedUser.user.username, t]);

    const handleChange = (_event: SyntheticEvent, newValue: number) => {
        setTab(newValue);
    };

    return (
        <>
            <Typography variant="h2">{t("User page")}</Typography>

            <article>
                {user.name}
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tab} onChange={handleChange}>
                        <Tab label={t("Profile")} />
                        <Tab label={t("Contributions")} />
                        <Tab label={t("Password change")} disabled={!canEdit} />
                    </Tabs>
                </Box>
                <CustomTabPanel value={tab} index={0}>
                    <Typography>{t("Username")}: {user.username}</Typography>
                    <Typography>{t("Email")}: {user.email}</Typography>
                    <Typography>{t("Name")}: {user.name}</Typography>
                    <Typography>{t("Level")}: {levelName(user.level)}</Typography>
                </CustomTabPanel>
                <CustomTabPanel value={tab} index={1}>
                    <ContributionsComponent user={user} />
                </CustomTabPanel>
                <CustomTabPanel value={tab} index={2}>
                    <ChangePasswordComponent />
                </CustomTabPanel>
            </article>
        </>
    );
}


