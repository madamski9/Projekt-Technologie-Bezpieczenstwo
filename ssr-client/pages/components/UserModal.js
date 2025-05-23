import React, { useState } from 'react'
import cookies from 'js-cookie'

const UserRolesManager = ({ user, allRoles, initialUserRoles, onClose, onRolesUpdate }) => {
  const [userRoles, setUserRoles] = useState(initialUserRoles)

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
      const res = await fetch(`/api/admin/users/${user.id}/roles`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ roles: userRoles }),
      })

      if (!res.ok) throw new Error("Błąd zapisu ról")

      onRolesUpdate?.(user.id, userRoles)

      alert("Role zapisane!")
      onClose()
    } catch (err) {
      console.error(err)
      alert("Nie udało się zapisać ról")
    }
  }

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <button className="closeButton" onClick={onClose}>&times;</button>
        <h3>Szczegóły użytkownika</h3>
        <p><strong>ID:</strong> {user?.id}</p>
        <p><strong>Nazwa użytkownika:</strong> {user?.username}</p>
        <p><strong>Email:</strong> {user?.email}</p>

        <h4>Role użytkownika:</h4>
        <div className="roleList">
          {(allRoles || []).map(role => (
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

        <button className="saveButton" onClick={handleSave}>
          Zapisz role
        </button>
      </div>
    </div>
  )
}

export default UserRolesManager
