import {createBrowserRouter} from "react-router-dom";
import PageComponent from "./pages/PageComponent.tsx";
import UserComponent from "./pages/UserComponent.tsx";
import Layout from "./components/layout/Layout.tsx";
import SignUpComponent from "./pages/SignupComponent.tsx";
import ActivateUserComponent from "./pages/ActivateUserComponent.tsx";
import ResetPasswordRequestComponent from "./pages/ResetPasswordRequestComponent.tsx";
import ResetPasswordComponent from "./pages/ResetPasswordComponent.tsx";
import NewPagesComponent from "./pages/NewPagesComponent.tsx";
import RecentChangesComponent from "./pages/RecentChangesComponent.tsx";
import NewUploadsComponent from "./pages/NewUploadsComponent.tsx";
import SearchComponent from "./pages/SearchComponent.tsx";
import UploadComponent from "./pages/UploadComponent.tsx";

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
    {
        path: "/newPages",
        element: <Layout><NewPagesComponent /></Layout>
    },
    {
        path: "/recentChanges",
        element: <Layout><RecentChangesComponent /></Layout>
    },
    {
        path: "/newUploads",
        element: <Layout><NewUploadsComponent /></Layout>
    },
    {
        path: "/upload/:title",
        element: <Layout><UploadComponent /></Layout>
    },
    {
        path: "/search/:query",
        element: <Layout><SearchComponent /></Layout>
    },
]);

export default router;