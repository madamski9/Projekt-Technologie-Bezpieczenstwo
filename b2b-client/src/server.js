import express from 'express'
import getAccessToken from './getAccessToken.js'
import dotenv from 'dotenv'
import cors from 'cors'

const app = express()
app.use(express.json())
dotenv.config()
app.use(cors())
const PORT = process.env.PORT

app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`)
    next()
})

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

app.post('/notifications/new-event', (req, res) => {
    console.log('POST /notifications/new-event otrzymany')
    const { event } = req.body
    console.log('Otrzymano powiadomienie o nowym wydarzeniu:', event)
    res.sendStatus(200)
})

app.listen(PORT, '0.0.0.0', () => {
    console.log(`B2B Client listening on port ${PORT}`)
})
