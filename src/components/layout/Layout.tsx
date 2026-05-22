import {ReactNode, useCallback, useEffect} from "react";
import DatalinksDrawer from "./DatalinksDrawer.tsx";
import Body from "./Body.tsx";
import Footer from "./Footer.tsx";
import {useAppSelector} from "../../hooks.ts";
import LoadingModal from "../LoadingModal.tsx";
import ErrorModal from "../ErrorModal.tsx";
import {useCookies} from "react-cookie";
import {setLoggedToken, setLoggedUser} from "../../redux/loggedUserSlice.ts";
import {fetchUserByLoginToken} from "../../service/UserService.ts";
import {newUser, User} from "../../model/user/User.ts";
import {useDispatch} from "react-redux";
import {setConfig} from "../../redux/configSlice.ts";
import {AssociativeArray, log} from "../../service/Common.ts";
import {Configlet} from "../../model/page/Configlet.ts";
import {cookieOptions} from "../../service/Common.ts";

const fetchConfig = async () : Promise<Configlet[]> => {
    const data = await fetch(import.meta.env.VITE_API + '/config/all');
    if (data.ok) {
        return await data.json();
    } else {
        log('Error fetching config: ' + data);
        return Promise.reject(data);
    }
}

export default function Layout(props: { children?: ReactNode }) : ReactNode | null {

    const loading = useAppSelector((state) => state.loading.value);
    const showError = useAppSelector((state) => state.showError.value);
    const errorMessage = useAppSelector((state) => state.showError.message);
    const loggedUser = useAppSelector((state) => state.loggedUser);
    const dispatch = useDispatch();
    const [cookies, _setcookies, removeCookie] = useCookies(['loginToken']);

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
                    {props.children}
                </Body>
                <Footer />
            </DatalinksDrawer>
        </>
    );
}