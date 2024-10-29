import {ReactNode, useEffect, useState} from 'react';
import {useLocation} from "react-router-dom";
import '../css/pagecomponent.css';
import {useDispatch} from "react-redux";
import {User} from "../model/user/User.ts";
import {useAppSelector} from "../hooks.ts";
import {setLoggedUser} from "../redux/loggedUserSlice.ts";


export default function UserComponent() : ReactNode | null {

    const fetchUser = async (username : string) : Promise<User> => {
        const data = await fetch(import.meta.env.VITE_API + '/user/' + username);
        return data.json();
    }

    const loggedUser = useAppSelector((state) => state.loggedUser);

    const dispatch = useDispatch();

    const location = useLocation();

    const [username, setUsername] = useState('');
    const [name, setName] = useState('');

    useEffect(() => {
        const usernamePath = location.pathname.split('/')[2];

        const apiResponse = fetchUser(usernamePath);
        apiResponse.then(data => {

            setUsername(data.username);
            setName(data.name);
            document.title = import.meta.env.VITE_SITE_TITLE + ' - ' + data.username;
        });

        debugger;


    }, [dispatch, location.pathname]);


    return (
        <>
            <h1>User: {username}</h1>
            <p>
                {name}
            </p>
        </>
    )
}


