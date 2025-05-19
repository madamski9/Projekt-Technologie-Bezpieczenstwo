"use client"
import React, { useEffect, useState } from 'react'
import cookies from 'js-cookie'
import UserRolesManager from './components/UserModal'
import UserCreateModal from './components/CreateUserModal'

const LandingPage = () => {
    const [users, setUsers] = useState([])
    const [error, setError] = useState(null)
    const [selectedUser, setSelectedUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isCreatingUser, setIsCreatingUser] = useState(false)

    const handleLogout = async (e) => {
        e.preventDefault()
        window.location.href = process.env.NEXT_PUBLIC_LOGOUT_URL
    }

    const fetchUsers = async () => {
        const token = cookies.get('auth_token')
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users`, {
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
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    return (
        <div className="admin-container">
            <nav className="admin-navbar">
                <div className="navbar-brand">Panel Administratora</div>
                <button className="logout-button" onClick={handleLogout}>
                    Wyloguj się
                </button>
            </nav>

            <main className="admin-content">

                {error && <div className="error-message">{error}</div>}

                {isLoading ? (
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                        <p>Ładowanie danych...</p>
                    </div>
                ) : !error && (
                    <div className="users-section">
                        <h2 className="section-title">Lista użytkowników</h2>
                        <div className="users-grid">
                            {users.map(user => (
                                <div 
                                    key={user.id}
                                    className="user-card"
                                    onClick={() => setSelectedUser(user)}
                                >
                                    <div className="user-avatar">
                                        {user.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="user-info">
                                        <h3>{user.username}</h3>
                                        <p>{user.email}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {selectedUser && (
                    <UserRolesManager user={selectedUser} onClose={() => setSelectedUser(null)} />
                )}
                <button className="add-user-button" onClick={() => setIsCreatingUser(true)}>
                    Dodaj użytkownika
                </button>
                {isCreatingUser && (
                    <UserCreateModal
                        onClose={() => setIsCreatingUser(false)}
                        onUserCreated={fetchUsers}
                    />
                )}

            </main>
        </div>
    )
}

export default LandingPage