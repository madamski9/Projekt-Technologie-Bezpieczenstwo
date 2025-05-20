import { useEffect } from "react"
import { useRouter } from "next/navigation"
import cookies from 'js-cookie'
import { Loader2 } from 'lucide-react'

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
          cookies.set('user_role', 'korepetytor', { expires: 1, secure: false, sameSite: 'Lax' })
          router.push("/dashboard/korepetytor")
        } else if (roles.includes("uczen")) {
          cookies.set('user_role', 'uczen', { expires: 1, secure: false, sameSite: 'Lax' })
          router.push("/dashboard/uczen")
        } else if (roles.includes("admin")) {
          window.location.href = "http://localhost:3001"
        } else {
          router.push("/_error.js")
        }
      })
      .catch(err => {
        console.error("Token exchange failed", err)
        router.push("/login?error=auth_failed")
      })
    }
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
  '@keyframes spin': {
    from: {
      transform: 'rotate(0deg)',
    },
    to: {
      transform: 'rotate(360deg)',
    },
  },
}

export default Callback