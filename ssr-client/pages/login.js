const Login = () => {
  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2>Login</h2>
      <a href={process.env.NEXT_PUBLIC_KEYCLOAK_LOGIN_URL}>
        <button>Zaloguj przez Keycloak</button>
      </a>
    </div>
  )
}

export default Login

