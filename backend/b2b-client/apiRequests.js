import getAccessToken from "./getAccessToken"

const makeApiRequest = async (url, method = 'GET', body = null) => {
    const token = await getAccessToken()

    if (!token) {
        console.error("No token available")
        return
    }

    const response = await fetch(url, {
        method,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: body ? JSON.stringify(body) : null
    })

    if (response.ok) {
        return await response.json()
    } else {
        console.error('API request failed:', response.statusText)
        return null
    }
}

export default makeApiRequest
