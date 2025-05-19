import { useRouter } from "next/router"
import cookies from 'js-cookie'

const Navigation = () => {
  const router = useRouter()

  const navigate = (path) => {
    router.push(path)
  }
  const userRole = cookies.get('user_role')

  return (
    <nav className="nav">
      <ul className="nav-list">
        <li onClick={() => navigate("/")}>Strona główna</li>
        <li onClick={() => userRole === "uczen" ? navigate("/dashboard/uczen") : navigate("/dashboard/korepetytor")}>Dashboard</li>
        <li onClick={() => userRole === "uczen" ? navigate("/lekcje/uczen") : navigate("/lekcje/korepetytor")}>Lekcje</li>
        <li onClick={() => navigate("/profil")}>Profil</li>
      </ul>
    </nav>
  )
}

export default Navigation
