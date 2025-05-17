"use client"
import React, { useEffect, useState } from 'react'
import cookies from 'js-cookie'

const LandingPage = () => {
    const [users, setUsers] = useState([])
    const [error, setError] = useState(null)
    const [selectedUser, setSelectedUser] = useState(null)

    const handleLogout = async (e) => {
        e.preventDefault()
        window.location.href = process.env.NEXT_PUBLIC_LOGOUT_URL
    }

    const fetchUsers = async () => {
        const token = cookies.get('auth_token')
        try {
            const res = await fetch("http://localhost:3000/api/admin/users", {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                credentials: "include",
            })

            if (!res.ok) throw new Error("Nie udało się pobrać użytkowników")
            const data = await res.json()
            setUsers(data)
        } catch (err) {
            console.error(err)
            setError("Błąd pobierania użytkowników")
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    return (
        <div className="container">
            <h1>Witamy w panelu administratora!</h1>

            <button className="logoutButton" onClick={handleLogout}>
                Logout
            </button>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {!error && (
                <div className="userList">
                    <h2>Użytkownicy Keycloaka:</h2>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {users.map(user => (
                            <li 
                                key={user.id}
                                className="userItem"
                                onClick={() => setSelectedUser(user)}
                            >
                                <strong>{user.username}</strong> <br />
                                <span>{user.email}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {selectedUser && (
                <div className="modalOverlay">
                    <div className="modalContent">
                        <button className="closeButton" onClick={() => setSelectedUser(null)}>
                            &times;
                        </button>
                        <h3>Szczegóły użytkownika</h3>
                        <p><strong>ID:</strong> {selectedUser.id}</p>
                        <p><strong>Nazwa użytkownika:</strong> {selectedUser.username}</p>
                        <p><strong>Email:</strong> {selectedUser.email}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default LandingPage
