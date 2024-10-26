import {createBrowserRouter} from "react-router-dom";
import Page from "./pages/Page.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Page />,
        children: [
            {
                path: "/Page/:title",
                element: <Page />,
            }
        ]
    },
]);

export default router;