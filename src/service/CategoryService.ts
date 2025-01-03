export const fetchCategories = async (page: number | null, pageSize: number | null) => {
    const data = await fetch(import.meta.env.VITE_API + '/category/all?page=' + page + '&pageSize=' + pageSize);
    if (data.ok) {
        return data.json();
    } else {
        return Promise.reject(data.status);
    }
}

export const fetchCategory = async (category: string) => {
    const data = await fetch(import.meta.env.VITE_API + '/category/get/' + category);
    if (data.ok) {
        return data.json();
    } else {
        return Promise.reject(data.status);
    }
}

export const findCategories = async (query: string) => {
    const data = await fetch(import.meta.env.VITE_API + '/category/find/' + query);
    if (data.ok) {
        return data.json();
    } else {
        return Promise.reject(data.status);
    }
}

export const addCategory = async (category: string, token: string) => {
    const data = await fetch(import.meta.env.VITE_API + '/category/add', {
        method: 'PUT',
        headers: {
            'Content-Type': 'text/plain',
            'Authorization': 'Bearer ' + token,
        },
        body: category
    });
    if (data.ok) {
        return data.text();
    } else {
        return Promise.reject(data.status);
    }
}

export const deleteCategory = async (category: string, token: string) => {
    const data = await fetch(import.meta.env.VITE_API + '/category/delete/' + category, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + token,
        },
    });
    if (data.ok) {
        return data.text();
    } else {
        return Promise.reject(data.status);
    }
}