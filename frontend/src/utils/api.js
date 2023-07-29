export const URL = "http://127.0.0.1:" + "8000";

export const apiCall = (path, data, type, token) => {
    return new Promise((resolve, reject) => {
        fetch(`${URL}` + `${path}`, {
            method: type,
            headers: {
                "Content-Type": "application/json",
                Authorization: `${token}`,
            },
            body: type !== "GET" ? JSON.stringify(data) : undefined,
        }).then(async (response) => {
            if (response.status === 200) {
                return response.json().then(resolve);
            } else {
                const res = await response.json();
                reject(response.status);
            } 
        });
    });
};
