import {ReactNode} from "react";

export default function Header() : ReactNode | null {
    return (
        <header>
            <img src={'/images/datalinks.svg'}  alt='Site logo' />
        </header>
    );
}