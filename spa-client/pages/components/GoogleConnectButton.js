const GoogleConnectButton = () => {
  const handleConnect = () => {
    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_CALLBACK_URL,
      response_type: 'code',
      scope: `${process.env.NEXT_PUBLIC_GOOGLE_AUTH_CALENDAR} ${process.env.NEXT_PUBLIC_GOOGLE_USER_MAIL}`,
      access_type: 'offline',
      prompt: 'consent',
    })

    window.location.href = `${process.env.NEXT_PUBLIC_GOOGLE_AUTH_PARAMS}?${params.toString()}`
  }

  return <button onClick={handleConnect}>Połącz z Google Kalendarzem</button>
}

export default GoogleConnectButton

