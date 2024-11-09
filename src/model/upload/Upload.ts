export interface Upload {
    filename: string;
    slug: string;
    description?: string;
    creationDate?: Date;
    modifiedDate?: Date;
}

export const newUpload = () : Upload => {
    return {
        filename: "",
        slug: ""
    };
}