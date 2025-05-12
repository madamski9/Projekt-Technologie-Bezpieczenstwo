import express from 'express'
import checkJwt from './middlewares/auth.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import saveUser from './utils/saveUser.js'
import jwt from 'jsonwebtoken'
import requireRoles from './utils/requireRole.js'
import makeApiRequest from '../b2b-client/apiRequests.js'

dotenv.config()
const app = express()
const PORT = process.env.PORT 
app.use('/api', checkJwt())
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

app.get('/health', (req, res) => {
    res.status(200).send('OK');
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
                client_id: 'ssr-client',
                client_secret: process.env.KEYCLOAK_CLIENT_SECRET_SSR,
                redirect_uri: process.env.KEYCLOAK_REDIRECT_URI,
                scope: 'openid email profile',
            })
        })

        const tokenData = await response.json()
        if (tokenData.access_token) {
            const decoded = jwt.decode(tokenData.access_token)
            console.log("decoded: ", decoded)
            console.log("token data: ", tokenData)
        
            const userInfo = {
              sub: decoded.sub,
              email: decoded.email,
              name: decoded.name,
              picture: decoded.picture || null 
            }
        
            await saveUser(userInfo)
        
            res.cookie('auth_token', tokenData.access_token, {
                httpOnly: true,
                maxAge: 3600000,
                sameSite: 'Lax'
            })
            res.json({ message: 'Login successful', user: userInfo })
        } else {
            res.status(400).json({ message: 'token exchange failed', tokenData })
        }
    } catch (err) {
        res.status(500).json({ message: 'internal error', error: err.toString() })
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
        console.log("token: ", tokenData.access_token)

        const userRes = await fetch(process.env.GOOGLE_USER_INFO_URL, {
        headers: {
            Authorization: `Bearer ${tokenData.access_token}`
        }
        })

        const userInfo = await userRes.json()
        console.log("userInfo: ", userInfo)
        await saveUser(userInfo)
        res.json({ message: "Logged in via Google!", userInfo })
    } catch (err) {
        console.error("Error during token exchange:", err)
        res.status(500).json({ error: 'OAuth flow failed' })
    }
})
  
app.get('/api/korepetytor', requireRoles('korepetytor'), (req, res) => {
    res.send('Hello tutor')
})

app.get('/api/dashboard', requireRoles(['korepetytor', 'uczen']), (req, res) => {
    res.json({ message: 'You have access to the dashboard' })
})

app.post('/auth/logout', express.json(), async (req, res) => {
    const refreshToken = req.body.refresh_token
    if (!refreshToken) return res.status(400).json({ message: 'No refresh token provided' })
  
    try {
      const response = await fetch(`${process.env.KEYCLOAK_LOGOUT}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: process.env.KEYCLOAK_CLIENT_ID,
          client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
          refresh_token: refreshToken
        })
      })
      res.clearCookie('auth_token')
      if (response.ok) {
        return res.status(200).json({ message: 'Logged out successfully' })
      } else {
        res.status(500).json({ message: 'error during logging out' })
      }
    } catch (err) {
      return res.status(500).json({ message: 'Logout failed', error: err.toString() })
    }
})

app.get('/data', async (req, res) => {
    const data = await makeApiRequest(`${process.env.FRONTEND_URL}/callback`)
    if (data) {
        res.json(data)
    } else {
        res.status(500).send('Error fetching data from API')
    }
})
  
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))