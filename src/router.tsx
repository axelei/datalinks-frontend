import {lazy} from "react";
import {createBrowserRouter} from "react-router-dom";
import Layout from "./components/layout/Layout.tsx";
import ErrorBoundary from "./components/ErrorBoundary.tsx";

const PageComponent = lazy(() => import("./pages/PageComponent.tsx"));
const UserComponent = lazy(() => import("./pages/UserComponent.tsx"));
const SignUpComponent = lazy(() => import("./pages/SignupComponent.tsx"));
const ActivateUserComponent = lazy(() => import("./pages/ActivateUserComponent.tsx"));
const ResetPasswordRequestComponent = lazy(() => import("./pages/ResetPasswordRequestComponent.tsx"));
const ResetPasswordComponent = lazy(() => import("./pages/ResetPasswordComponent.tsx"));
const NewPagesComponent = lazy(() => import("./pages/NewPagesComponent.tsx"));
const RecentChangesComponent = lazy(() => import("./pages/RecentChangesComponent.tsx"));
const NewUploadsComponent = lazy(() => import("./pages/NewUploadsComponent.tsx"));
const SearchComponent = lazy(() => import("./pages/SearchComponent.tsx"));
const UploadComponent = lazy(() => import("./pages/UploadComponent.tsx"));
const EditsComponent = lazy(() => import("./pages/EditsComponent.tsx"));
const EditComponent = lazy(() => import("./pages/EditComponent.tsx"));
const AboutComponent = lazy(() => import("./pages/AboutComponent.tsx"));
const DiffComponent = lazy(() => import("./pages/DiffComponent.tsx"));
const UploadFileComponent = lazy(() => import("./pages/UploadFileComponent.tsx"));
const CategoriesComponent = lazy(() => import("./pages/CategoriesComponent.tsx"));
const CategoryPagesComponent = lazy(() => import("./pages/CategoryPagesComponent.tsx"));
const NotFoundComponent = lazy(() => import("./pages/NotFoundComponent.tsx"));

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
