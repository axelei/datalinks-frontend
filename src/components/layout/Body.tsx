import {ReactNode} from 'react';

export default function Body(props: { children?: ReactNode }) : ReactNode | null {

    return (
        <>
            <div id='body'>{props.children}</div>
        </>
    );
}