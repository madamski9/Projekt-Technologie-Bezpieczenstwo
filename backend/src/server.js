import express from 'express'
import checkJwt from './auth.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'

dotenv.config()
const app = express()
const PORT = process.env.PORT 
app.use(checkJwt())
app.use(cookieParser())
app.use(cors({
    origin: process.env.FRONTEND_URL, 
    credentials: true,
}))
app.use((req, res, next) => {
    console.log('Request Headers:', req.headers)
    next()
})

app.get('/api/hello', (req, res) => {
    res.json({ message: "Hello from backend" })
})

app.get('/protected', (req, res) => {
    res.send('Protected endpoint')
})

app.post('/auth/callback', express.json(), async (req, res) => {
    const code = req.body.code
    if (!code) return res.status(400).json({ message: 'Code not provided' })

    try {
        const response = await fetch(process.env.KEYCLOAK_TOKEN, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                client_id: 'frontend-client',
                redirect_uri: process.env.KEYCLOAK_REDIRECT_URI,
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

app.get('/auth/google', (req, res) => {
    const redirectUri = process.env.GOOGLE_AUTH_URI +
      new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        response_type: 'code',
        scope: 'openid email profile',
        access_type: 'offline',
        prompt: 'consent'
      }).toString()
  
    res.redirect(redirectUri)
  })
  
app.post('/auth/google/callback', express.json(), async (req, res) => {
    const { code } = req.body
    if (!code) return res.status(400).json({ error: 'Code missing' })

    try {
        const tokenRes = await fetch(process.env.GOOGLE_TOKEN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: process.env.GOOGLE_REDIRECT_URI,
            grant_type: 'authorization_code'
        })
        })

        const tokenData = await tokenRes.json()

        const userRes = await fetch(process.env.GOOGLE_USER_INFO_URL, {
        headers: {
            Authorization: `Bearer ${tokenData.access_token}`
        }
        })

        const userInfo = await userRes.json()
        res.json({ message: "Logged in via Google!", userInfo })
    } catch (err) {
        console.error("Error during token exchange:", err)
        res.status(500).json({ error: 'OAuth flow failed' })
    }
})
  
  

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))