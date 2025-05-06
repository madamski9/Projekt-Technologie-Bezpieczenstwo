import express from 'express'
import checkJwt from './auth.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()
const PORT = process.env.PORT || "3000"
app.use(checkJwt())
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:3001', 
    credentials: true,
}))
app.use((req, res, next) => {
    console.log('Request Headers:', req.headers)
    next()
})

app.get('/api/hello', (req, res) => {
    res.json({ message: "Hello from backend" })
})

app.get('/protected', checkJwt(), (req, res) => {
    res.send('Protected endpoint')
})

app.post('/auth/callback', express.json(), async (req, res) => {
    const code = req.body.code
    if (!code) return res.status(400).json({ message: 'Code not provided' })

    try {
        const response = await fetch('http://keycloak:8080/realms/korepetycje/protocol/openid-connect/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                client_id: 'frontend-client',
                redirect_uri: 'http://localhost:3001/callback'
            })
        })

        const tokenData = await response.json()
        if (tokenData.access_token) {
            res.cookie('auth_token', tokenData.access_token, {
                httpOnly: true,
                maxAge: 3600000,
                sameSite: 'Lax'
            })
            res.json({ message: 'Login successful' })
        } else {
            res.status(400).json({ message: 'Token exchange failed', tokenData })
        }
    } catch (err) {
        res.status(500).json({ message: 'Internal error', error: err.toString() })
    }
})


app.listen(PORT, () => console.log(`Server running on port ${PORT}`))