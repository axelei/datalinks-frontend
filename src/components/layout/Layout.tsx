import {useCallback, useEffect} from "react";
import {Outlet} from "react-router-dom";
import DatalinksDrawer from "./DatalinksDrawer.tsx";
import Body from "./Body.tsx";
import Footer from "./Footer.tsx";
import {useAppDispatch, useAppSelector} from "../../hooks.ts";
import LoadingModal from "../LoadingModal.tsx";
import ErrorModal from "../ErrorModal.tsx";
import {useCookies} from "react-cookie";
import {setLoggedToken, setLoggedUser} from "../../redux/loggedUserSlice.ts";
import {fetchUserByLoginToken} from "../../service/UserService.ts";
import {newUser, User} from "../../model/user/User.ts";
import {setConfig} from "../../redux/configSlice.ts";
import {AssociativeArray} from "../../service/Common.ts";
import {Configlet} from "../../model/page/Configlet.ts";
import {cookieOptions} from "../../service/Common.ts";
import {fetchConfig} from "../../service/ConfigService.ts";

export default function Layout() {

    const loading = useAppSelector((state) => state.loading.count > 0);
    const showError = useAppSelector((state) => state.showError.value);
    const errorMessage = useAppSelector((state) => state.showError.message);
    const loggedUser = useAppSelector((state) => state.loggedUser);
    const dispatch = useAppDispatch();
    const [cookies, , removeCookie] = useCookies(['loginToken']);

    const loadConfig = useCallback(() => {
        fetchConfig()
            .then((config : Configlet[]) => {
                const tempConfig : AssociativeArray<string> = {};
                config.forEach((configlet : Configlet) => {
                    tempConfig[configlet.key] = configlet.value;
                });
                dispatch(setConfig(tempConfig));
            }).catch((error) => {
                console.log(error);
                const tempConfig : AssociativeArray<string> = {};
                dispatch(setConfig(tempConfig));
            });
    }, [dispatch]);

    useEffect(() => {
        document.title = import.meta.env.VITE_SITE_TITLE;
        const token = cookies.loginToken;
        if (token && !loggedUser.token) {
            fetchUserByLoginToken(token)
                .then((user : User) => {
                    dispatch(setLoggedToken(token));
                    dispatch(setLoggedUser({...user}));
                }).catch((error) => {
                    console.log(error);
                    removeCookie('loginToken', {...cookieOptions});
                    dispatch(setLoggedUser(newUser()));
                    dispatch(setLoggedToken(''));
                }).finally(() => {
                    loadConfig();
                });
        } else {
            loadConfig();
        }
    }, [cookies.loginToken, dispatch, loggedUser.token, removeCookie, loadConfig]);

    return (<>
            <ErrorModal show={showError} message={errorMessage} />
            <LoadingModal loading={loading} />
            <DatalinksDrawer>
                <Body>
                    <Outlet />
                </Body>
                <Footer />
            </DatalinksDrawer>
        </>
    );
}