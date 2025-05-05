const fetchApi = async () => {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)auth_token\s*=\s*([^;]*).*$)|^.*$/, "$1");
    if (!token) {
        console.error("token not found error")
        return
    }
    console.log("token: ", token)

    try {
        const res = await fetch(`${process.env.API_URL}/protected`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // keycloak JWT token
            },
            credentials: 'include',
        })
        if (!res.ok) {
            throw new Error(`API Error: ${res.statusText}`);
        }

        const data = await res.json()
        return data
    } catch (e) {
        console.error("error during fetching api data: ", e)
    }
}

export default fetchApi