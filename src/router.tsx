import {createBrowserRouter} from "react-router-dom";
import NotFoundComponent from "./pages/NotFoundComponent.tsx";
import ErrorBoundary from "./components/ErrorBoundary.tsx";
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
        element: <Layout />,
        errorElement: <ErrorBoundary />,
        children: [
            {
                path: "/",
                element: <PageComponent />,
            },
            {
                path: "/page/:title",
                element: <PageComponent />,
            },
            {
                path: "/user/:name",
                element: <UserComponent />
            },
            {
                path: "/activateUser/:token",
                element: <ActivateUserComponent />
            },
            {
                path: "/resetPassword/:token",
                element: <ResetPasswordComponent />
            },
            {
                path: "/signup",
                element: <SignUpComponent />
            },
            {
                path: "/passwordReset",
                element: <ResetPasswordRequestComponent />
            },
            {
                path: "/newPages",
                element: <NewPagesComponent />
            },
            {
                path: "/recentChanges",
                element: <RecentChangesComponent />
            },
            {
                path: "/newUploads",
                element: <NewUploadsComponent />
            },
            {
                path: "/upload/:title",
                element: <UploadComponent />
            },
            {
                path: "/search/:query",
                element: <SearchComponent />
            },
            {
                path: "/edits/:query",
                element: <EditsComponent />
            },
            {
                path: "/edit/:query",
                element: <EditComponent />
            },
            {
                path: "/about",
                element: <AboutComponent />
            },
            {
                path: "/diff/:diff1/:diff2",
                element: <DiffComponent />
            },
            {
                path: "/uploadFile",
                element: <UploadFileComponent />
            },
            {
                path: "/categories",
                element: <CategoriesComponent />
            },
            {
                path: "/category/:query",
                element: <CategoryPagesComponent />
            },
            {
                path: "*",
                element: <NotFoundComponent />
            }
        ],
    },
]);

export default router;
