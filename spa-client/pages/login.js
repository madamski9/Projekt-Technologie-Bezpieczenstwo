import { Lock, LogIn } from 'lucide-react'

const Login = () => {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <Lock size={40} color="#3b82f6" />
          <h1 style={styles.title}>Logowanie</h1>
        </div>
        
        <p style={styles.subtitle}>Zaloguj się, aby uzyskać dostęp do platformy</p>
        
        <a 
          href={process.env.NEXT_PUBLIC_KEYCLOAK_LOGIN_URL} 
          style={styles.loginLink}
        >
          <button style={styles.loginButton}>
            <LogIn size={20} style={styles.buttonIcon} />
            Zaloguj przez Keycloak
          </button>
        </a>
        
        <div style={styles.footer}>
          <p style={styles.footerText}>Masz problem z logowaniem?</p>
          <a href="/help" style={styles.helpLink}>Skontaktuj się z pomocą techniczną</a>
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
    minHeight: '95vh',
    backgroundColor: '#f8fafc',
    padding: '20px',
    fontFamily: "'Inter', sans-serif",
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    padding: '40px',
    width: '100%',
    maxWidth: '450px',
    textAlign: 'center',
    marginBottom: '70px'
  },
  logo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '20px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1e293b',
    margin: '16px 0 0 0',
  },
  subtitle: {
    fontSize: '16px',
    color: '#64748b',
    margin: '0 0 30px 0',
    lineHeight: '1.5',
  },
  loginLink: {
    textDecoration: 'none',
    display: 'block',
  },
  loginButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    width: '100%',
    padding: '14px 20px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 5px rgba(59, 130, 246, 0.3)',
    ':hover': {
      backgroundColor: '#2563eb',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(59, 130, 246, 0.4)',
    },
  },
  buttonIcon: {
    marginRight: '8px',
  },
  footer: {
    marginTop: '30px',
    paddingTop: '20px',
    borderTop: '1px solid #e2e8f0',
  },
  footerText: {
    color: '#64748b',
    fontSize: '14px',
    margin: '0 0 8px 0',
  },
  helpLink: {
    color: '#3b82f6',
    fontSize: '14px',
    fontWeight: '500',
    textDecoration: 'none',
    transition: 'color 0.2s',
    ':hover': {
      color: '#2563eb',
      textDecoration: 'underline',
    },
  },
}

export default Login