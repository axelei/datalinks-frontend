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
import EditsComponent from "./pages/EditsComponent.tsx";
import EditComponent from "./pages/EditComponent.tsx";
import AboutComponent from "./pages/AboutComponent.tsx";
import DiffComponent from "./pages/DiffComponent.tsx";
import UploadFileComponent from "./pages/UploadFileComponent.tsx";
import CategoriesComponent from "./pages/CategoriesComponent.tsx";
import CategoryPagesComponent from "./pages/CategoryPagesComponent.tsx";

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
    {
        path: "/edits/:query",
        element: <Layout><EditsComponent /></Layout>
    },
    {
        path: "/edit/:query",
        element: <Layout><EditComponent /></Layout>
    },
    {
        path: "/about",
        element: <Layout><AboutComponent /></Layout>
    },
    {
        path: "/diff/:diff1/:diff2",
        element: <Layout><DiffComponent /></Layout>
    },
    {
        path: "/uploadFile",
        element: <Layout><UploadFileComponent /></Layout>
    },
    {
        path: "/categories",
        element: <Layout><CategoriesComponent /></Layout>
    },
    {
        path: "/category/:query",
        element: <Layout><CategoryPagesComponent /></Layout>
    }
]);

export default router;