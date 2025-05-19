import { useEffect } from "react"
import { useRouter } from "next/navigation"
import cookies from 'js-cookie'

const Callback = () => {
  const router = useRouter()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get("code")

    if (code) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ code }),
      })
      .then(res => res.json())
      .then(data => {
        console.log("Token exchanged:", data)
        
        const roles = data.roles || []
        console.log("role: ", roles)
        if (roles.includes("korepetytor")) {
          "use client"
          cookies.set('user_role', 'korepetytor', { expires: 1, secure: false, sameSite: 'Lax' })
          router.push("/dashboard/korepetytor")
        } else if (roles.includes("uczen")) {
          "use client"
          cookies.set('user_role', 'uczen', { expires: 1, secure: false, sameSite: 'Lax' })
          router.push("/dashboard/uczen")
        } else if (roles.includes("admin")) {
          window.location.href = "http://localhost:3001"
        } else {
          router.push("/dashboard")
        }
      })
      .catch(err => {
        console.error("Token exchange failed", err)
      })
    }
  }, [router])

  return (
    <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Ładowanie danych...</p>
    </div>
  )
}

export default Callback
