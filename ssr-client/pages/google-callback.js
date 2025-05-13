import { useEffect } from "react"
import { useRouter } from "next/navigation"
import cookies from 'js-cookie' 

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
        router.push("./dashboard") 
      })
      .catch(err => {
        console.error("Token exchange failed", err)
      })
    }
  }, [router])

  return <p>Logowanie trwa...</p>
}

export default GoogleCallback
