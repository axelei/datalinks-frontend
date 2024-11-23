type DeepClone<T> = T extends object ? { [K in keyof T]: DeepClone<T[K]> } : T;
export function clone<T>(obj: T): DeepClone<T> {
    return JSON.parse(JSON.stringify(obj));
}

export const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    textAlign: 'center',
};

export const log = (message : string | null | undefined) => {
    if (import.meta.env.MODE === 'development' || import.meta.env.VITE_IS_DEV) {
        const date = new Date();
        console.log(date + ' ' + message);
    }
}

export type AssociativeArray<Type> = {
    [key: string]: Type;
}

import {useEffect, useState} from "react";

export const useDebounce = <T>(value: T, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

export const formatDate = (date: Date | string | undefined) : string => {
    if (!date) {
        return '';
    }
    if (typeof date === 'string') {
        date = new Date(date);
    }
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()  + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
}

export const insertPageJumps = (html: string) : string => {
    return html.replace(/<\/p>/g, "</p>\n\n").replace(/<\/figure>/g, "</p>\n\n");
}