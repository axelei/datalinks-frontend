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

export const log = (message : string) => {
    if (import.meta.env.MODE === 'development' || import.meta.env.VITE_IS_DEV) {
        const date = new Date();
        console.log(date + ' ' + message);
    }
}