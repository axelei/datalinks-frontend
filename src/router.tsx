import {createBrowserRouter} from "react-router-dom";
import PageComponent from "./pages/PageComponent.tsx";
import UserComponent from "./pages/UserComponent.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <PageComponent/>,
    },
    {
        path: "/page/:title",
        element: <PageComponent />,
    },
    {
        path: "/user/:name",
        element: <UserComponent />
    },
]);

export default router;