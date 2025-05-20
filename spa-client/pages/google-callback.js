import { useEffect } from "react"
import { useRouter } from "next/navigation"
import cookies from 'js-cookie'
import { Loader2 } from 'lucide-react'

const GoogleCallback = () => {
  const router = useRouter()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get("code")

    if (code) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ code }),
      })
      .then(res => res.json())
      .then(data => {
        console.log("Token exchanged:", data)

        cookies.set('access_token', data.access_token, { expires: 1, secure: true, sameSite: 'Strict' })
        cookies.set('refresh_token', data.refresh_token, { expires: 1, secure: true, sameSite: 'Strict' })

        if (data.roles?.includes("uczen")) {
          router.push("/dashboard/lekcje/uczen")
        } else if (data.roles?.includes("korepetytor")) {
          router.push("/dashboard/lekcje/korepetytor")
        } else {
          router.push("/dashboard")
        }
      })
      .catch(err => {
        console.error("Token exchange failed", err)
        router.push("/login?error=google_auth_failed")
      })
    } else {
      router.push("/login?error=no_code")
    }
  }, [router])

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <Loader2 size={64} style={styles.spinner} />
        <div style={styles.textContainer}>
          <h2 style={styles.title}>Łączenie z Google</h2>
          <p style={styles.subtitle}>Trwa autoryzacja Twojego konta...</p>
        </div>
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
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px',
    maxWidth: '400px',
    textAlign: 'center',
    padding: '32px',
  },
  spinner: {
    animation: 'spin 1.5s linear infinite',
    color: '#4285F4', // Google blue
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1f2937',
    margin: 0,
  },
  subtitle: {
    fontSize: '1rem',
    color: '#6b7280',
    margin: 0,
  },
  '@keyframes spin': {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
  },
}

export default GoogleCallback