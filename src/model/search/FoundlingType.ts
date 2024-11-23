export enum FoundlingType {
    page = "PAGE",
    upload = "UPLOAD",
    category = "CATEGORY",
    user = "USER",
}

export const getFoundlingPath = (foundlingType : FoundlingType)=> {
    switch (foundlingType) {
        case FoundlingType.page:
            return "/page/";
        case FoundlingType.upload:
            return "/upload/";
        case FoundlingType.category:
            return "/category/";
        case FoundlingType.user:
            return "/user/";

    }
}