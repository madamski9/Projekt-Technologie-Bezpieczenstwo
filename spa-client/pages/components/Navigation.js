import { useRouter } from "next/router"

const Navigation = () => {
  const router = useRouter()

  const navigate = (path) => {
    router.push(path)
  }

  return (
    <nav className="nav">
      <ul className="nav-list">
        <li onClick={() => navigate("/")}>Strona główna</li>
        <li onClick={() => navigate("/dashboard")}>Dashboard</li>
        <li onClick={() => navigate("/lekcje")}>Lekcje</li>
        <li onClick={() => navigate("/profil")}>Profil</li>
      </ul>
    </nav>
  )
}

export default Navigation
