import dotenv from 'dotenv'
dotenv.config()

const getAccessToken = async () => {
    try {
        const res = await fetch(process.env.KEYCLOAK_TOKEN, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: process.env.B2B_CLIENT_ID,
            client_secret: process.env.B2B_CLIENT_SECRET,
            }),
        })
        if (res.ok) {
            const data = await res.json()
            return data.access_token
        } else {
            console.error("error during fetching keycloak token: ", res)
            return
        }
    } catch (e) {
        console.error("error during getting access token: ", e)
    }
}

export default getAccessToken