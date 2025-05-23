import React, { useState } from 'react'
import UserRolesManager from './components/UserModal'
import UserCreateModal from './components/CreateUserModal'

export async function getServerSideProps(context) {
  const token = context.req.cookies['auth_token']

  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  const [usersRes, rolesRes] = await Promise.all([
    fetch('http://backend:3000/api/admin/users', {
      headers: { Authorization: `Bearer ${token}` },
    }),
    fetch('http://backend:3000/api/admin/roles', {
      headers: { Authorization: `Bearer ${token}` },
    }),
  ])

  if (!usersRes.ok || !rolesRes.ok) {
    return {
      props: {
        usersData: [],
        rolesData: [],
        error: 'Błąd pobierania danych z serwera',
      },
    }
  }

  const [usersData, rolesData] = await Promise.all([
    usersRes.json(),
    rolesRes.json(),
  ])

  const userRolesMap = {}
  for (const user of usersData) {
    const res = await fetch(`http://backend:3000/api/admin/users/${user.id}/roles`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const userRoles = await res.json()
    userRolesMap[user.id] = userRoles.map(r => r.name)
  }

  return {
    props: {
      usersData,
      rolesData,
      userRolesMap,
      error: null,
    },
  }
}

const LandingPage = ({ usersData, rolesData, userRolesMap, error }) => {
  const [selectedUser, setSelectedUser] = useState(null)
  const [isCreatingUser, setIsCreatingUser] = useState(false)
  const [userRolesMapState, setUserRolesMapState] = useState(userRolesMap)

  return (
    <div className="admin-container">
      <nav className="admin-navbar">
        <div className="navbar-brand">Panel Administratora</div>
        <button className="logout-button" onClick={() => window.location.href = process.env.NEXT_PUBLIC_LOGOUT_URL}>
          Wyloguj się
        </button>
      </nav>

      <main className="admin-content">
        {error && <div className="error-message">{error}</div>}

        {!error && (
          <>
            <div className="users-section">
              <h2 className="section-title">Lista użytkowników</h2>
              <div className="users-grid">
                {usersData.map((user) => (
                  <div
                    key={user.id}
                    className="user-card"
                    onClick={() => setSelectedUser(user)}
                  >
                    <div className="user-avatar">{user.username.charAt(0).toUpperCase()}</div>
                    <div className="user-info">
                      <h3>{user.username}</h3>
                      <p>{user.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button className="add-user-button" onClick={() => setIsCreatingUser(true)}>
              Dodaj użytkownika
            </button>
          </>
        )}

        {selectedUser && (
          <UserRolesManager 
            user={selectedUser} 
            allRoles={rolesData} 
            initialUserRoles={userRolesMapState?.[selectedUser.id] || []}
            onClose={() => setSelectedUser(null)} 
            onRolesUpdate={(userId, newRoles) =>
              setUserRolesMapState(prev => ({
                ...prev,
                [userId]: newRoles,
            }))}
            />
        )}

        {isCreatingUser && (
          <UserCreateModal
            allRoles={rolesData}
            onClose={() => setIsCreatingUser(false)}
          />
        )}
      </main>
    </div>
  )
}

export default LandingPage
