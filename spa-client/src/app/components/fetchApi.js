const fetchApi = async () => {
    try {
        const res = await fetch(`${process.env.API_URL}/protected`, {
            method: 'GET',
            credentials: 'include', 
        })
        if (!res.ok) {
            throw new Error(`API Error: ${res.statusText}`);
        }

        const data = await res.text()
        return data
    } catch (e) {
        console.error("error during fetching api data: ", e)
    }
}


export default fetchApi