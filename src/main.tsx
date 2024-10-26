import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './css/main.css'
import {RouterProvider} from "react-router-dom";
import router from "./router.tsx";
import Footer from "./components/layout/Footer.tsx";
import Header from "./components/layout/Header.tsx";


createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Header />
      <RouterProvider router={router} />
      <Footer />
  </StrictMode>,
)
