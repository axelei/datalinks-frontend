export interface Category {
    name: string;
    creationDate?: Date;
}

export const newCategory = (name: string) : Category => {
    return {
        name: name,
        creationDate: new Date(Date.now())
    };
}
