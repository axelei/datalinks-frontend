import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './css/main.css'
import {RouterProvider} from "react-router-dom";
import router from "./router.tsx";
import Footer from "./components/layout/Footer.tsx";
import Header from "./components/layout/Header.tsx";
import Body from "./components/layout/Body.tsx";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {Provider} from "react-redux";
import {store} from './redux/store.ts'
import DatalinksDrawer from "./components/layout/DatalinksDrawer.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>
            <DatalinksDrawer>
                <Header />
                <Body>
                  <RouterProvider router={router} />
                </Body>
                <Footer />
            </DatalinksDrawer>
        </Provider>
    </StrictMode>,
)
