import {createBrowserRouter} from "react-router-dom";
import PageComponent from "./pages/PageComponent.tsx";
import UserComponent from "./pages/UserComponent.tsx";
import Layout from "./components/layout/Layout.tsx";
import SignUpComponent from "./pages/SignupComponent.tsx";
import ActivateUserComponent from "./pages/ActivateUserComponent.tsx";
import ResetPasswordRequestComponent from "./pages/ResetPasswordRequestComponent.tsx";
import ResetPasswordComponent from "./pages/ResetPasswordComponent.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout><PageComponent /></Layout>,
    },
    {
        path: "/page/:title",
        element: <Layout><PageComponent /></Layout>,
    },
    {
        path: "/user/:name",
        element: <Layout><UserComponent /></Layout>
    },
    {
        path: "/activateUser/:token",
        element: <Layout><ActivateUserComponent /></Layout>
    },
    {
        path: "/resetPassword/:token",
        element: <Layout><ResetPasswordComponent /></Layout>
    },
    {
        path: "/signup",
        element: <Layout><SignUpComponent /></Layout>
    },
    {
        path: "/passwordReset",
        element: <Layout><ResetPasswordRequestComponent /></Layout>
    },
]);

export default router;