import {createBrowserRouter} from "react-router-dom";
import PageComponent from "./pages/PageComponent.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <PageComponent />,
        children: [
            {
                path: "/page/:title",
                element: <PageComponent />,
            }
        ]
    },
]);

export default router;