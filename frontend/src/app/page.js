"use client"
// import "./globals.css"
import fetchApi from "./components/fetchApi"
import login from "./components/login"
import { useEffect, useState } from "react"

const Home = () => {
  const [receivedData, setReceivedData] = useState(null)
  const [receivedLoginData, setReceivedLoginData] = useState(null)

  console.log("received data: ", receivedData)
  console.log("received login data: ", receivedLoginData)

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2>Login</h2>
      <a href="http://localhost:8080/realms/korepetycje/protocol/openid-connect/auth?client_id=frontend-client&redirect_uri=http://localhost:3001/callback&response_type=code">
        <button>Zaloguj przez Keycloak</button>
      </a>
    </div>
  )
}

export default Home

