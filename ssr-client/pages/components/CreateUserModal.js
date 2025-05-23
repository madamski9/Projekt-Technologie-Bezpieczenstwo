import React, { useState } from 'react'
import cookies from 'js-cookie'

const UserCreateModal = ({ allRoles, onClose }) => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [selectedRoles, setSelectedRoles] = useState([])

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
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ username, email, password, roles: selectedRoles }),
      })

      if (!res.ok) throw new Error("Błąd tworzenia użytkownika")

      alert("Użytkownik utworzony!")
      onClose()
    } catch (err) {
      console.error(err)
      alert("Nie udało się utworzyć użytkownika")
    }
  }

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <button className="closeButton" onClick={onClose}>&times;</button>
        <h3>Dodaj nowego użytkownika</h3>

        <label>
          Nazwa użytkownika:
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
        </label>

        <label>
          Email:
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
        </label>

        <label>
          Hasło:
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        </label>

        <h4>Role użytkownika:</h4>
        <div className="roleList">
          {(allRoles || []).map(role => (
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

        <button className="saveButton" onClick={handleCreate}>
          Utwórz użytkownika
        </button>
      </div>
    </div>
  )
}

export default UserCreateModal
