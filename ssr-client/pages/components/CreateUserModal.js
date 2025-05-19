"use client"
import React, { useEffect, useState } from 'react'
import cookies from 'js-cookie'

const UserCreateModal = ({ onClose, onUserCreated }) => {
    const [allRoles, setAllRoles] = useState([])
    const [selectedRoles, setSelectedRoles] = useState([])
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(true)

    const fetchRoles = async () => {
        try {
            const token = cookies.get('auth_token')
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/roles`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include'
            })

            const data = await res.json()
            setAllRoles(data)
        } catch (err) {
            console.error("Błąd pobierania ról:", err)
        } finally {
            setLoading(false)
        }
    }

    const handleToggleRole = (roleName) => {
        setSelectedRoles(prev =>
            prev.includes(roleName)
                ? prev.filter(r => r !== roleName)
                : [...prev, roleName]
        )
    }

    const handleCreate = async () => {
        if (!username || !email || !password) {
            alert("Wszystkie pola są wymagane")
            return
        }

        try {
            const token = cookies.get('auth_token')
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include',
                body: JSON.stringify({
                    username,
                    email,
                    password,
                    roles: selectedRoles
                })
            })

            if (!res.ok) throw new Error("Błąd tworzenia użytkownika")

            alert("Użytkownik utworzony!")
            onClose()
            onUserCreated?.()
        } catch (err) {
            console.error(err)
            alert("Nie udało się utworzyć użytkownika")
        }
    }

    useEffect(() => {
        fetchRoles()
    }, [])

    return (
        <div className="modalOverlay">
            <div className="modalContent">
                <button className="closeButton" onClick={onClose}>&times;</button>
                <h3>Dodaj nowego użytkownika</h3>

                <label>
                    Nazwa użytkownika:
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </label>

                <label>
                    Email:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </label>

                <label>
                    Hasło:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>

                <h4>Role użytkownika:</h4>
                {loading ? (
                    <p>Ładowanie ról...</p>
                ) : (
                    <div className="roleList">
                        {Array.isArray(allRoles) && allRoles.map(role => (
                            <label key={role.id}>
                                <input
                                    type="checkbox"
                                    checked={selectedRoles.includes(role.name)}
                                    onChange={() => handleToggleRole(role.name)}
                                />
                                {role.name}
                            </label>
                        ))}
                    </div>
                )}

                <button className="saveButton" onClick={handleCreate}>
                    Utwórz użytkownika
                </button>
            </div>
        </div>
    )
}

export default UserCreateModal
