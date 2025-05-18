"use client"
import React, { useEffect, useState } from 'react'
import cookies from 'js-cookie'

const UserRolesManager = ({ user, onClose }) => {
    const [allRoles, setAllRoles] = useState(null)
    const [userRoles, setUserRoles] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchRoles = async () => {
        try {
            const token = cookies.get('auth_token')
            console.log("token2: ", token)
            const [allRes, userRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/roles`, {
                    headers: { 
                      'Authorization': `Bearer ${token}`
                    },
                    credentials: 'include'
                }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${user.id}/roles`, {
                    headers: { 
                      'Authorization': `Bearer ${token}`
                    },
                    credentials: 'include'
                })
            ])
            const allData = await allRes.json()
            const userData = await userRes.json()

            setAllRoles(allData)
            setUserRoles(userData.map(role => role.name))
        } catch (err) {
            console.error("Błąd pobierania ról:", err)
        } finally {
            setLoading(false)
        }
    }

    console.log("role: ", allRoles)
    console.log("role uzytkownikow: ", userRoles)

    const handleToggleRole = (roleName) => {
        setUserRoles(prev =>
            prev.includes(roleName)
                ? prev.filter(r => r !== roleName)
                : [...prev, roleName]
        )
    }

    const handleSave = async () => {
        try {
            const token = cookies.get('auth_token')
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${user.id}/roles`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                credentials: 'include',
                body: JSON.stringify({ roles: userRoles }),
            })

            if (!res.ok) throw new Error("Błąd zapisu ról")
            alert("Role zapisane!")
        } catch (err) {
            console.error(err)
            alert("Nie udało się zapisać ról")
        }
    }

    useEffect(() => {
        fetchRoles()
    }, [])

    return (
        <div className="modalOverlay">
            <div className="modalContent">
                <button className="closeButton" onClick={onClose}>&times;</button>
                <h3>Szczegóły użytkownika</h3>
                <p><strong>ID:</strong> {user.id}</p>
                <p><strong>Nazwa użytkownika:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>

                <h4>Role użytkownika:</h4>
                {loading ? (
                    <p>Ładowanie ról...</p>
                ) : (
                    <div className="roleList">
                        {Array.isArray(allRoles) && allRoles.map(role => (
                            <label key={role.id}>
                                <input
                                    type="checkbox"
                                    checked={userRoles.includes(role.name)}
                                    onChange={() => handleToggleRole(role.name)}
                                />
                                {role.name}
                            </label>
                        ))}
                    </div>
                )}

                <button className="saveButton" onClick={handleSave}>
                    Zapisz role
                </button>
            </div>
        </div>
    )
}

export default UserRolesManager
