import {ReactNode} from 'react';
import LoadingModal from "../LoadingModal.tsx";
import {useAppSelector} from "../../hooks.ts";

export default function Body(props: { children: ReactNode }) : ReactNode | null {

    const loading = useAppSelector((state) => state.loading.value);

    return (
        <>
            <LoadingModal loading={loading} />
            <div>{props.children}</div>
        </>
    );
}