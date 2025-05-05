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

app.get('/protected', (req, res) => {
    res.send('Protected endpoint')
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))