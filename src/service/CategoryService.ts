export const fetchCategories = async (page: number | null, pageSize: number | null) => {
    const data = await fetch(import.meta.env.VITE_API + '/category/all?page=' + page + '&pageSize=' + pageSize);
    if (data.ok) {
        return data.json();
    } else {
        return Promise.reject(data.status);
    }
}