import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './css/main.css'
import {RouterProvider} from "react-router-dom";
import router from "./router.tsx";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {Provider} from "react-redux";
import {store} from './redux/store.ts'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    </StrictMode>,
)
