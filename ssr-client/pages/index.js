import React, { useState } from 'react'
import UserRolesManager from './components/UserModal'
import UserCreateModal from './components/CreateUserModal'
import cookies from 'js-cookie'

export async function getServerSideProps(context) {
  try {
    const token = context.req.cookies['auth_token']
    console.log(token)

    if (!token) {
        return {
        redirect: {
            destination: '/login',
            permanent: false,
        },
        }
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include',
    })
    console.log("res: ", res)

    if (!res.ok) {
      throw new Error('Fetch failed')
    }

    const data = await res.json()
    console.log('Fetched users data:', data)

    return {
      props: {
        usersData: data,
        error: null,
      },
    }
  } catch (err) {
    return {
      props: {
        usersData: [],
        error: 'Błąd pobierania użytkowników',
      },
    }
  }
}

const LandingPage = ({ usersData, error }) => {
  const [users, setUsers] = useState(usersData || [])
  const [selectedUser, setSelectedUser] = useState(null)
  const [isCreatingUser, setIsCreatingUser] = useState(false)

  const handleLogout = (e) => {
    e.preventDefault()
    window.location.href = process.env.NEXT_PUBLIC_LOGOUT_URL
  }

  const refreshUsers = async () => {
    try {
        const token = cookies.get('auth_token')
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include'
      })
      const data = await res.json()
      console.log("DATA: ", data)
      setUsers(data)
    } catch (err) {
      console.error('Błąd odświeżania użytkowników')
    }
  }

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

        {!error && (
          <div className="users-section">
            <h2 className="section-title">Lista użytkowników</h2>
            <div className="users-grid">
              {users.map((user) => (
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
            onUserCreated={refreshUsers}
          />
        )}
      </main>
    </div>
  )
}

export default LandingPage
