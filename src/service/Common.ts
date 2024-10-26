type DeepClone<T> = T extends object ? { [K in keyof T]: DeepClone<T[K]> } : T;
export function clone<T>(obj: T): DeepClone<T> {
    return JSON.parse(JSON.stringify(obj));
}