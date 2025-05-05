import express from 'express'
import checkJwt from './auth.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()
const PORT = process.env.PORT || "3000"
app.use(checkJwt())
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:3000', 
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

app.post('/login', async (req, res) => {
    const response = await fetch('http://keycloak:8080/realms/korepetycje/protocol/openid-connect/token', {
        method: 'POST',
        body: new URLSearchParams({
            'client_id': `${process.env.KEYCLOAK_CLIENT_ID}`,
            'client_secret': `${process.env.KEYCLOAK_CLIENT_SECRET}`,
            'grant_type': 'password',
            'username': req.body.username,
            'password': req.body.password,
        }),
    })

    if (response.ok) {
        const { access_token } = await response.json()

        res.cookie('auth_token', access_token, {
            httpOnly: true,      
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'None',     
            maxAge: 3600000,      
        })

        return res.json({ message: 'Login successful' })
    } else {
        return res.status(401).json({ message: 'Invalid credentials' })
    }
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))