import "./globals.css"

const Home = () => {
  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2>Login</h2>
      <a href="http://localhost:8080/realms/korepetycje/protocol/openid-connect/auth?client_id=ssr-client&redirect_uri=http://localhost:3002/callback&response_type=code&scope=openid">
        <button>Zaloguj przez Keycloak</button>
      </a>
      <a href="http://localhost:3000/auth/google">
        <button>Loguj się przez Google</button>
      </a>
    </div>
  )
}

export default Home

