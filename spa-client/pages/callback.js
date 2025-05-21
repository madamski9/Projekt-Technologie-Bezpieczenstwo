'use client'

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import cookies from 'js-cookie'
import { Loader2 } from 'lucide-react'

const Callback = () => {
  const router = useRouter()

  useEffect(() => {
    const handleAuth = async () => {
      const urlParams = new URLSearchParams(window.location.search)
      const code = urlParams.get("code")

      if (!code) {
        router.push("/login?error=missing_code")
        return
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/callback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ code }),
        })

        if (!res.ok) throw new Error("Token exchange failed")

        const data = await res.json()
        const roles = data.roles || []
        const token = cookies.get("auth_token")
        console.log("token: ", token)

        if (roles.includes("korepetytor")) {
          cookies.set('user_role', 'korepetytor', { expires: 1, secure: false, sameSite: 'Lax' })

          const checkRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/check-user`, {
            method: "GET",
            headers: {
              'Authorization': `Bearer ${token}`
            },
            credentials: "include",
          })

          if (!checkRes.ok) throw new Error("User check failed")
          const checkData = await checkRes.json()
          console.log("user data: ", checkData)

          if (!checkData.exists) {
            router.push("/uzupelnij-profil/korepetytor") 
          } else {
            router.push("/dashboard/korepetytor")
          }

        } else if (roles.includes("uczen")) {
          cookies.set('user_role', 'uczen', { expires: 1, secure: false, sameSite: 'Lax' })

          const checkRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/check-user`, {
            method: "GET",
            headers: {
              'Authorization': `Bearer ${token}`
            },
            credentials: "include",
          })

          if (!checkRes.ok) throw new Error("User check failed")
          const checkData = await checkRes.json()
          console.log("user data: ", checkData)

          if (!checkData.exists) {
            router.push("/uzupelnij-profil/uczen") 
          } else {
            router.push("/dashboard/uczen")
          }

        } else if (roles.includes("admin")) {
          window.location.href = "http://localhost:3001"

        } else {
          router.push("/rejestracja")
        }

      } catch (err) {
        console.error("Błąd podczas autoryzacji:", err)
        router.push("/login?error=auth_failed")
      }
    }

    handleAuth()
  }, [router])

  return (
    <div style={styles.container}>
      <div style={styles.spinnerContainer}>
        <Loader2 size={48} style={styles.spinner} />
        <p style={styles.text}>Trwa przekierowywanie...</p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
    backgroundColor: '#f8fafc',
    fontFamily: "'Inter', sans-serif",
  },
  spinnerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
  },
  spinner: {
    animation: 'spin 1s linear infinite',
    color: '#3b82f6',
  },
  text: {
    fontSize: '1.25rem',
    color: '#64748b',
    fontWeight: '500',
  },
}

export default Callback
