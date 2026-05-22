interface ApiOptions {
    method?: string;
    body?: unknown;
    token?: string;
    contentType?: string;
}

export async function api<T>(path: string, options: ApiOptions = {}): Promise<T> {
    const headers: Record<string, string> = {};
    if (options.token) {
        headers['Authorization'] = 'Bearer ' + options.token;
    }
    if (options.contentType) {
        headers['Content-Type'] = options.contentType;
    }
    const fetchOptions: RequestInit = { method: options.method ?? 'GET', headers };
    if (options.body !== undefined) {
        fetchOptions.body = options.body as BodyInit;
    }
    const url = import.meta.env.VITE_API + path;
    const data = await fetch(url, fetchOptions);
    if (data.ok) {
        const text = await data.text();
        if (!text) return undefined as T;
        try { return JSON.parse(text) as T; } catch { return text as T; }
    } else {
        return Promise.reject(data.status);
    }
}

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
    if (import.meta.env.DEV) {
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

const isSecureEnv = (): boolean => {
    return import.meta.env.MODE === 'production' || import.meta.env.VITE_IS_SECURE === 'true';
}

export const cookieOptions = {
    path: '/',
    sameSite: 'strict' as const,
    secure: isSecureEnv(),
    maxAge: 60 * 60 * 24 * 30,
};