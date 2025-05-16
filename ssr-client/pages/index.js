"use client"
import React, { useEffect, useState } from 'react'
import cookies from 'js-cookie'

const LandingPage = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const handleLogout = async (e) => {
        e.preventDefault()
        window.location.href = process.env.NEXT_PUBLIC_LOGOUT_URL
    }

    const fetchUsers = async () => {
        const token = cookies.get('auth_token')
        console.log("fetch users, auth token: ", token)

        const res = await fetch("http://localhost:3000/api/admin/users", {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            credentials: "include",
        })

        if (!res.ok) {
            throw new Error("Nie udało się pobrać użytkowników")
        }

        const data = await res.json()
        console.log(data)
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    return (
        <div style={{ padding: 40, textAlign: 'center' }}>
            <h1>Witamy w panelu administratora!</h1>

            <button onClick={(e) => handleLogout(e)} style={{ marginBottom: 20 }}>
                Logout
            </button>

            {loading && <p>Ładowanie użytkowników...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {!loading && !error && (
                <div style={{ maxWidth: 600, margin: '0 auto' }}>
                    <h2>Użytkownicy Keycloaka:</h2>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {users.map(user => (
                            <li key={user.id} style={{ borderBottom: "1px solid #ccc", padding: "10px 0" }}>
                                <strong>{user.username}</strong> <br />
                                <span>{user.email}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default LandingPage
