const login = async (username, password) => {
    try {
        const res = await fetch(`${process.env.API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                username,
                password,
            }),
            credentials: 'include',
        })
        if (!res.ok) {
            console.error("error during fetching login response: ", res)
        }
        
        const data = await res.json()
        return data
    } catch (e) {
        console.error("error during logging in: ", e)
    }
}

export default login