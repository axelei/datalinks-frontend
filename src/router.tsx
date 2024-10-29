import {createBrowserRouter} from "react-router-dom";
import PageComponent from "./pages/PageComponent.tsx";
import UserComponent from "./pages/UserComponent.tsx";
import Layout from "./components/layout/Layout.tsx";

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
]);

export default router;