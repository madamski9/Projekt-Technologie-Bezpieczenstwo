import { useEffect } from "react"
import { useRouter } from "next/navigation"
import cookies from 'js-cookie'

const Callback = () => {
  const router = useRouter()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get("code")
    console.log("env: ", process.env.NEXT_PUBLIC_API_URL)

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

        cookies.set('access_token', data.access_token, { expires: 1, secure: true, sameSite: 'Strict' })
        cookies.set('refresh_token', data.refresh_token, { expires: 1, secure: true, sameSite: 'Strict' })
        
        const roles = data.roles || []
        console.log("role: ", roles)
        if (roles.includes("korepetytor")) {
          router.push("/dashboard/korepetytor")
        } else if (roles.includes("uczen")) {
          router.push("/dashboard/uczen")
        } else {
          router.push("dashboard")
        }
      })
      .catch(err => {
        console.error("Token exchange failed", err)
      })
    }
  }, [router])

  return <p>Logowanie trwa...</p>
}

export default Callback
