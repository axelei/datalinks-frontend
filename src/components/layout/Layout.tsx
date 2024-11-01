import {ReactNode} from "react";
import DatalinksDrawer from "./DatalinksDrawer.tsx";
import Header from "./Header.tsx";
import Body from "./Body.tsx";
import Footer from "./Footer.tsx";
import {useAppSelector} from "../../hooks.ts";
import LoadingModal from "../LoadingModal.tsx";
import ErrorModal from "../ErrorModal.tsx";

export default function Layout(props: { children?: ReactNode }) : ReactNode | null {

    const loading = useAppSelector((state) => state.loading.value);
    const showError = useAppSelector((state) => state.showError.value);

    return (<>
            <ErrorModal show={showError} />
            <LoadingModal loading={loading} />
            <DatalinksDrawer>
                <Header />
                <Body>
                    {props.children}
                </Body>
                <Footer />
            </DatalinksDrawer>
        </>
    );
}