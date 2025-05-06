"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

const Callback = () => {
  const router = useRouter()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get("code")

    if (code) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/callback`, {
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
        router.push("./mainSite") 
      })
      .catch(err => {
        console.error("Token exchange failed", err)
      })
    }
  }, [router])

  return <p>Logowanie trwa...</p>
}

export default Callback
