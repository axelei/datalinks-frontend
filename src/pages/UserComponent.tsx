import {ReactNode, useEffect, useState} from 'react';
import {useLocation} from "react-router-dom";
import {useDispatch} from "react-redux";
import {User} from "../model/user/User.ts";
import {setLoggedUser} from "../redux/loggedUserSlice.ts";


export default function UserComponent() : ReactNode | null {

    const fetchUser = async (username : string) : Promise<User> => {
        const data = await fetch(import.meta.env.VITE_API + '/user/' + username);
        return data.json();
    }

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

        dispatch(setLoggedUser({username: usernamePath, name: 'sdfsdf', email: 'sdfsdf', userLevel: 'admin'}));

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


