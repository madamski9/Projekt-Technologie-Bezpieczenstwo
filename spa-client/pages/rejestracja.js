import { User, BookOpen, GraduationCap, ChevronRight, Edit3, Info } from 'lucide-react'
import { useState } from 'react'
import cookies from 'js-cookie'
import { useRouter } from 'next/router'

const Rejestracja = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    role: '',
    description: ''
  })
  const [roleSelected, setRoleSelected] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleRoleSelect = (role) => {
    setFormData(prev => ({
      ...prev,
      role: role,
      description: ''
    }))
    setRoleSelected(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.role) {
      alert('Proszę wybrać rolę (korepetytor lub uczeń)')
      return
    }

    try {
      const token = cookies.get("auth_token")

      const profileRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
        headers: { 'Authorization': `Bearer ${token}` },
      })
      const user = await profileRes.json()
      console.log("user id: ", user.id)

      const roleRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/public/set-role/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ role: formData.role }),
        credentials: 'include'
      })

      if (!roleRes.ok) throw new Error("Nie udało się przypisać roli")

      // await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${user.id}/profile`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`,
      //   },
      //   body: JSON.stringify({ description: formData.description }),
      // })

      if (formData.role === 'korepetytor') {
        router.push('/uzupelnij-profil/korepetytor')
      } else {
        router.push('/uzupelnij-profil/uczen')
      }

    } catch (err) {
      console.error("Błąd podczas rejestracji:", err)
      alert("Wystąpił błąd. Spróbuj ponownie.")
    }
  }


  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Stwórz konto</h1>
          <p style={styles.subtitle}>Dołącz do naszej platformy edukacyjnej</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>
              <User size={18} style={styles.icon} />
              Kim jesteś?
            </label>
            <div style={styles.roleSelector}>
              <button
                type="button"
                style={{
                  ...styles.roleButton,
                  ...(formData.role === 'korepetytor' ? styles.roleButtonActive : {}),
                  ...(!roleSelected ? styles.roleButtonInactive : {})
                }}
                onClick={() => handleRoleSelect('korepetytor')}
              >
                <GraduationCap size={20} />
                Korepetytor
              </button>
              <button
                type="button"
                style={{
                  ...styles.roleButton,
                  ...(formData.role === 'uczen' ? styles.roleButtonActive : {}),
                  ...(!roleSelected ? styles.roleButtonInactive : {})
                }}
                onClick={() => handleRoleSelect('uczen')}
              >
                <BookOpen size={20} />
                Uczeń
              </button>
            </div>
          </div>

          {formData.role && (
            <>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  {formData.role === 'korepetytor' ? (
                    <>
                      <Edit3 size={18} style={styles.icon} />
                      Krótko o sobie
                    </>
                  ) : (
                    <>
                      <Info size={18} style={styles.icon} />
                      Czego szukasz?
                    </>
                  )}
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder={
                    formData.role === 'korepetytor' 
                      ? 'Opisz swoje doświadczenie i podejście do nauczania' 
                      : 'Opisz jakie korepetycje Cię interesują'
                  }
                  style={styles.textarea}
                  maxLength="200"
                  rows="3"
                  required
                />
              </div>
            </>
          )}

          <button 
            type="submit" 
            style={{
              ...styles.submitButton,
              ...(!formData.role ? styles.submitButtonDisabled : {})
            }}
            disabled={!formData.role}
          >
            Zarejestruj się
            <ChevronRight size={20} />
          </button>

          <div style={styles.loginLink}>
            Masz już konto? <a href="/login" style={styles.link}>Zaloguj się</a>
          </div>
        </form>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    fontFamily: "'Inter', sans-serif",
    padding: '1rem',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '500px',
  },
  header: {
    marginBottom: '2rem',
    textAlign: 'center',
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '0.5rem',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#64748b',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#334155',
  },
  icon: {
    color: '#64748b',
  },
  input: {
    padding: '0.75rem 1rem',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '1rem',
    transition: 'all 0.2s',
    ':focus': {
      outline: 'none',
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
    },
  },
  textarea: {
    padding: '0.75rem 1rem',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '1rem',
    resize: 'vertical',
    minHeight: '80px',
    transition: 'all 0.2s',
    ':focus': {
      outline: 'none',
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
    },
  },
  roleSelector: {
    display: 'flex',
    gap: '0.75rem',
    marginTop: '0.5rem',
  },
  roleButton: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.75rem',
    backgroundColor: '#f1f5f9',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    color: '#64748b',
    fontSize: '0.9rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  roleButtonActive: {
    backgroundColor: '#dbeafe',
    borderColor: '#3b82f6',
    color: '#1e40af',
  },
  roleButtonInactive: {
    ':hover': {
      backgroundColor: '#e2e8f0',
    },
  },
  submitButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.75rem',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginTop: '0.5rem',
    ':hover': {
      backgroundColor: '#2563eb',
    },
  },
  submitButtonDisabled: {
    backgroundColor: '#e2e8f0',
    color: '#94a3b8',
    cursor: 'not-allowed',
    ':hover': {
      backgroundColor: '#e2e8f0',
    },
  },
  loginLink: {
    textAlign: 'center',
    marginTop: '1.5rem',
    color: '#64748b',
    fontSize: '0.9rem',
  },
  link: {
    color: '#3b82f6',
    fontWeight: '500',
    textDecoration: 'none',
    ':hover': {
      textDecoration: 'underline',
    },
  },
}

export default Rejestracja