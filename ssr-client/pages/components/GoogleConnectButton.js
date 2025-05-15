const GoogleConnectButton = () => {
  const handleConnect = () => {
    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      redirect_uri: 'http://localhost:3002/google-callback',
      response_type: 'code',
      scope: 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.email',
      access_type: 'offline',
      prompt: 'consent',
    });

    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`
  }

  return <button onClick={handleConnect}>Połącz z Google Kalendarzem</button>
}

export default GoogleConnectButton;
