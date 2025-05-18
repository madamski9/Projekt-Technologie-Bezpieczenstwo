import express from 'express'
import checkJwt from './middlewares/auth.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import saveUser from './utils/saveUser.js'
import jwt from 'jsonwebtoken'
import requireRoles from './utils/requireRole.js'
import cookie from 'cookie'
import getKeycloakAdminClient from './utils/getKeycloakAdminClient.js'

dotenv.config()
const app = express()
const PORT = process.env.PORT 
app.use(cors({
    origin: [process.env.FRONTEND_URL, "http://localhost:3001"], 
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.use('/api', checkJwt())
app.use(cookieParser())
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
        console.log("token data: ", tokenData)
        console.log("id_token: ", tokenData.id_token)

        if (tokenData.access_token && tokenData.id_token) {
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
                httpOnly: false,
                maxAge: 3600000,
                sameSite: 'Lax'
            })
            res.cookie('id_token', tokenData.id_token, {
                httpOnly: true,
                maxAge: 3600000,
                sameSite: 'Lax'
            })
            const roles = decoded.realm_access?.roles || []
            res.json({ 
                message: 'Login successful', 
                user: userInfo, 
                roles,
                access_token: tokenData.access_token,
                refresh_token: tokenData.refresh_token
            })
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
        const cookies = cookie.parse(req.headers.cookie || "")
        const jwtToken = cookies["auth_token"] 

        const googleJwtToken = tokenData.access_token  

        res.cookie('google_token', googleJwtToken, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 1000, 
            sameSite: 'lax'
        })

        if (!jwtToken) {
            return res.status(401).json({ message: "brak tokena JWT w ciasteczkach" })
        }
        const decoded = jwt.decode(jwtToken)
        const roles = decoded?.realm_access?.roles || []

        return res.json({
            message: "Logged via Google!",
            userInfo: userInfo,
            roles: roles, 
        })
    } catch (err) {
        console.error("Error during token exchange:", err)
        res.status(500).json({ error: 'OAuth flow failed' })
    }
})

app.get('/google/calendar/events', async (req, res) => {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).json({ error: 'Brak nagłówka Authorization' })

  const token = authHeader.split(' ')[1]
  const calendarId = "24e4503631de91fbae635719c39955f1b96785b5c42bc2eb2fcdf76f1e7b8533@group.calendar.google.com"

  try {
    const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      return res.status(response.status).json(errorData)
    }

    const events = await response.json()
    res.json(events)
  } catch (err) {
    res.status(500).json({ error: err.toString() })
  }
})

app.post('/google/calendar/add-event', express.json(), async (req, res) => {
    const authHeader = req.headers.authorization
    const token = authHeader?.split(' ')[1]

    if (!token) {
        return res.status(401).json({ error: 'brak tokenu google' })
    }

    const { summary, start, end } = req.body
    if (!summary || !start || !end) {
        return res.status(400).json({ error: 'brakuje pol: summary, start, end' })
    }

    const calendarId = '24e4503631de91fbae635719c39955f1b96785b5c42bc2eb2fcdf76f1e7b8533@group.calendar.google.com'

    const eventData = {
        summary,
        start: { dateTime: start },
        end: { dateTime: end }
    }

    try {
        const googleRes = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
        })

        const result = await googleRes.json()

        if (!googleRes.ok) {
            return res.status(googleRes.status).json(result)
        }

        return res.status(200).json({ message: 'wydarzenie dodane', event: result })
    } catch (err) {
        console.error('blad dodawania wydarzenia:', err)
        return res.status(500).json({ error: 'wewnetrzny blad serwera' })
    }
})

  
app.get('/api/korepetytor', requireRoles('korepetytor'), (req, res) => {
    res.send('Hello tutor')
})

app.get('/api/dashboard', requireRoles(['korepetytor', 'uczen']), (req, res) => {
    res.json({ 
        message: `Welcome, ${req.user.username}`, 
        roles: req.user.roles 
    })
})

app.get('/auth/logout', (req, res) => {
  const idToken = req.cookies.id_token

  res.clearCookie('auth_token', { httpOnly: true, sameSite: 'Lax' })
  res.clearCookie('id_token', { httpOnly: true, sameSite: 'Lax' })

  const postLogoutRedirect = encodeURIComponent('http://localhost:3002')
  const logoutURL = `http://localhost:8080/realms/korepetycje/protocol/openid-connect/logout?id_token_hint=${idToken}&post_logout_redirect_uri=${postLogoutRedirect}`

  return res.redirect(logoutURL)
})

app.get('/api/admin/users', requireRoles(['admin']), async (req, res) => {
    try {
        const kcAdminClient = await getKeycloakAdminClient()
        const users = await kcAdminClient.users.find()

        const filteredUsers = users.map(user => ({
            id: user.id,
            username: user.username,
            email: user.email,
        }))

        res.status(200).json(filteredUsers)
    } catch (err) {
        console.error('Błąd podczas pobierania użytkowników z Keycloak:', err)
        res.status(500).json({ message: 'Wystąpił błąd serwera.' })
    }
})

app.get('/api/admin/roles', requireRoles(['admin']), async (req, res) => {
  try {
    const kcAdminClient = await getKeycloakAdminClient()
    const roles = await kcAdminClient.roles.find()
    res.json(roles)
  } catch (err) {
    console.error('Błąd pobierania ról:', err)
    res.status(500).json({ message: 'Błąd serwera' })
  }
})

app.get('/api/admin/users/:id/roles', requireRoles(['admin']), async (req, res) => {
    try {
        const kcAdminClient = await getKeycloakAdminClient()
        const userId = req.params.id

        const userRoles = await kcAdminClient.users.listRealmRoleMappings({ id: userId })

        res.status(200).json(userRoles.map(role => ({
            id: role.id,
            name: role.name,
            description: role.description
        })))
    } catch (err) {
        console.error("Błąd podczas pobierania ról użytkownika:", err)
        res.status(500).json({ message: 'Wystąpił błąd podczas pobierania ról użytkownika.' })
    }
})


app.put('/api/admin/users/:id/roles', express.json(), requireRoles(['admin']), async (req, res) => {
  const userId = req.params.id
  const roles = req.body.roles

  try {
    const kcAdminClient = await getKeycloakAdminClient()
    const currentRoles = await kcAdminClient.users.listRealmRoleMappings({ id: userId })
    const allRoles = await kcAdminClient.roles.find()
    const rolesToAssign = allRoles.filter(role => roles.includes(role.name))
    const rolesToRemove = currentRoles.filter(role => !roles.includes(role.name))

    await kcAdminClient.users.delRealmRoleMappings({
      id: userId,
      roles: rolesToRemove
    })

    await kcAdminClient.users.addRealmRoleMappings({
      id: userId,
      roles: rolesToAssign
    })

    res.status(200).json({ message: 'Zaktualizowano role użytkownika' })
  } catch (err) {
    console.error('Błąd aktualizacji ról:', err)
    res.status(500).json({ message: 'Błąd serwera' })
  }
})


  
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))