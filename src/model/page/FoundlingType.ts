export enum FoundlingType {
    page = "PAGE",
    upload = "UPLOAD",
}

export const getFoundlingPath = (foundlingType : FoundlingType)=> {
    switch (foundlingType) {
        case FoundlingType.page:
            return "/page/";
        case FoundlingType.upload:
            return "/upload/"
    }
}