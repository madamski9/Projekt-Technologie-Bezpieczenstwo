import React from 'react'
import { useRouter } from 'next/router'

const ErrorPage = () => {
  const router = useRouter()

  const handleGoHome = () => {
    router.push('/')
  }

  return (
    <div className="error-container">
      <h1 className="error-code">404</h1>
      <h2 className="error-message">Strona nie została znaleziona</h2>
      <p className="error-description">Wygląda na to, że ta strona nie istnieje lub została przeniesiona.</p>
      <button className="error-button" onClick={handleGoHome}>
        Wróć na stronę główną
      </button>
    </div>
  )
}

export default ErrorPage
