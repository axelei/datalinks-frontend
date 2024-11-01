import {createBrowserRouter} from "react-router-dom";
import PageComponent from "./pages/PageComponent.tsx";
import UserComponent from "./pages/UserComponent.tsx";
import Layout from "./components/layout/Layout.tsx";
import SignUpComponent from "./pages/SignupComponent.tsx";

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
        path: "/signup",
        element: <Layout><SignUpComponent /></Layout>
    },
]);

export default router;