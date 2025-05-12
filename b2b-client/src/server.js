import express from 'express'
import getAccessToken from './getAccessToken.js'

const app = express()

app.get('/b2b/ping-api', async (req, res) => {
    const token = await getAccessToken()
    console.log("b2b token from getAccessToken: ", token)

    const response = await fetch(`${process.env.API_URL}/api/hello`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    if (!response.ok) {
        const text = await response.text()
        console.error("Request failed:", response.status, text)
        return res.status(response.status).send(text)
    }
    const data = await response.json()
    return res.json(data)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`B2B Client listening on port ${PORT}`)
})
