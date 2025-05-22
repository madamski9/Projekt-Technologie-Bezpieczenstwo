import { useRouter } from "next/router"
import cookies from 'js-cookie'

const Navigation = () => {
  const router = useRouter()

  const navigate = (path) => {
    router.push(path)
  }
  const handleLogout = async () => {
    return window.location.href = process.env.NEXT_PUBLIC_LOGOUT_URL
  }

  const userRole = cookies.get("user_role")
  return (
    <nav className="nav">
      <ul className="nav-list">
        <li onClick={() => userRole === "uczen" ? navigate("/dashboard/uczen") : navigate("/dashboard/korepetytor")}>Strona główna</li>
        <li onClick={() => userRole === "uczen" ? navigate("/dashboard/lekcje/uczen") : navigate("/dashboard/lekcje/korepetytor")}>Lekcje</li>
      </ul>
      <button className="logout-button" onClick={handleLogout}>
        Wyloguj się
      </button>
    </nav>
  )
}

export default Navigation
