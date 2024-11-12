import {ReactNode, useEffect} from "react";
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

export default function Layout(props: { children?: ReactNode }) : ReactNode | null {

    const loading = useAppSelector((state) => state.loading.value);
    const showError = useAppSelector((state) => state.showError.value);
    const loggedUser = useAppSelector((state) => state.loggedUser);
    const dispatch = useDispatch();
    const [cookies, _setcookies, removeCookie] = useCookies(['loginToken']);

    const fetchConfig = async () : Promise<Configlet[]> => {
        const data = await fetch(import.meta.env.VITE_API + '/config/all');
        if (data.ok) {
            return await data.json();
        } else {
            log('Error fetching config: ' + data);
            return Promise.reject(data);
        }
    }

    useEffect(() => {
        document.title = import.meta.env.VITE_SITE_TITLE;
        if (cookies.loginToken && !loggedUser.token) {
            fetchUserByLoginToken(cookies.loginToken)
                .then((user : User) => {
                    dispatch(setLoggedToken(cookies.loginToken));
                    dispatch(setLoggedUser({...user}));
                }).catch((error) => {
                    console.log(error);
                    removeCookie('loginToken', {path: '/'});
                    dispatch(setLoggedUser(newUser()));
                    dispatch(setLoggedToken(''));
                });
        }
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
    }, [cookies.loginToken, dispatch, loggedUser.token, removeCookie]);

    return (<>
            <ErrorModal show={showError} />
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