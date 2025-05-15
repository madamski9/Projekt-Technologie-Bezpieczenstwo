"use client"
import React from 'react'

const LandingPage = () => {
    const handleLogout = async (e) => {
        e.preventDefault()
        return window.location.href = process.env.NEXT_PUBLIC_LOGOUT_URL
    }
    return (
        <div style={{ padding: 40, textAlign: 'center' }}>
            <h1>Witamy w panelu administratora!</h1>
            <button onClick={(e) => handleLogout(e)}>
                Logout
            </button>
        </div>
    )
}

export default LandingPage
