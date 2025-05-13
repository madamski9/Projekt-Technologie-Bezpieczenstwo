import { useState } from "react"

const Dashboard = () => {
  const [hasRole, setHasRole] = useState(false)
  const [message, setMessage] = useState([])
  const [roles, setRoles] = useState([])

  const handleClick = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard`, {
        method: 'GET',
        headers: { "Content-type": "application/json"},
        credentials: 'include',
      })
      if (res.ok) {
        setHasRole(true)
      } else {
        setHasRole(false)
      }
      const data = await res.json()
      console.log("data from fetching dashboard: ", data)
      if (data) {
        setMessage(data.message)
        setRoles(data.roles)
      }
      return data
    } catch (e) {
      console.error("error during getting status from /api/dashboard: ", e)
    }
  }
  console.log("role: ", roles)

  const handleLogout = async () => {
    return window.location.href = 'http://localhost:3000/auth/logout'
  }



  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <div>Dashboard, your roles - 
        {roles
          .filter(rola => rola === "uczen" || rola === "korepetytor")
          .map(rola => { return <p>{rola}</p> })
        }
        </div>
      <div
        onClick={(e) => handleClick(e)}
        style={{ backgroundColor: "red"}}
      >
        {hasRole ? (
          <div>
            You have access
          </div>
        ) : (
          <div>
            You dont have access
          </div>
        )}
      </div>
      <div>{message}</div>
      <button
        onClick={(e) => handleLogout(e)}
      >
        Logout
      </button>
    </div>
  )
}

export default Dashboard

