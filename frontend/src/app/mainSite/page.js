"use client"

import { useState } from "react"

const mainSite = () => {
  const [hasRole, setHasRole] = useState(false)
  const [message, setMessage] = useState([])

  const handleClick = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard`, {
        method: 'GET',
        headers: { "Content-type": "application/json"},
        credentials: 'include',
      })
      if (res.ok) {
        setHasRole(true)
      } else {
        setHasRole(false)
      }
      const data = await res.json()
      console.log("data from fetching dashboard: ", data)
      if (data) {
        setMessage(data.message)
      }
      return data
    } catch (e) {
      console.error("error during getting status from /api/dashboard: ", e)
    }
  }

  const handleLogout = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('http://localhost:3000/auth/logout', {
        method: 'POST',
        credentials: 'include', 
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      if (res.ok) {
        window.location.href = '/'
      } else {
        console.error('Logout failed')
      }
    } catch (e) {
      console.error("error during logging out: ", e)
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <div>mainSite</div>
      <div
        onClick={(e) => handleClick(e)}
        style={{ backgroundColor: "red"}}
      >
        {hasRole ? (
          <div>
            You have access
          </div>
        ) : (
          <div>
            You dont have access
          </div>
        )}
      </div>
      <div>{message}</div>
      <button
        onClick={(e) => handleLogout(e)}
      >
        Logout
      </button>
    </div>
  )
}

export default mainSite

