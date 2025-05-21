import { BookOpen, MapPin, Info, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/router'

const UzupelnijProfilUczen = () => {
    const router = useRouter()
    const [formData, setFormData] = useState({
        poziom: '',
        lokalizacja: '',
        opis: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/add-student`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
                credentials: "include"
            })

            if (!res.ok) {
                throw new Error('Błąd przy zapisie profilu')
            }

            const data = await res.json()
            console.log('Zapisano profil:', data)
            window.location.href = process.env.NEXT_PUBLIC_KEYCLOAK_LOGIN_URL
        } catch (err) {
            console.error('Błąd zapisu:', err)
            alert('Wystąpił problem podczas zapisywania profilu.')
        }
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <h1 style={styles.title}>Uzupełnij swój profil</h1>
                    <p style={styles.subtitle}>Dokończ konfigurację konta, aby znaleźć idealnego korepetytora</p>
                </div>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.formGrid}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                <BookOpen size={18} style={styles.icon} />
                                Poziom nauki
                            </label>
                            <select
                                name="poziom"
                                value={formData.poziom}
                                onChange={handleChange}
                                style={styles.select}
                                required
                            >
                                <option value="">Wybierz poziom</option>
                                <option value="szkola_podstawowa">Szkoła podstawowa</option>
                                <option value="liceum">Liceum</option>
                                <option value="technikum">Technikum</option>
                                <option value="studia">Studia</option>
                            </select>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                <MapPin size={18} style={styles.icon} />
                                Lokalizacja
                            </label>
                            <input
                                type="text"
                                name="lokalizacja"
                                value={formData.lokalizacja}
                                onChange={handleChange}
                                placeholder="np. Warszawa, Online"
                                style={styles.input}
                                required
                            />
                        </div>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>
                            <Info size={18} style={styles.icon} />
                            Dodatkowe informacje
                        </label>
                        <textarea
                            name="opis"
                            value={formData.opis}
                            onChange={handleChange}
                            placeholder="Opisz swoje oczekiwania, szczególne potrzeby itp."
                            style={styles.textarea}
                            rows={4}
                        />
                    </div>

                    <button type="submit" style={styles.submitButton}>
                        Zapisz profil
                        <ChevronRight size={20} />
                    </button>
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
        minHeight: '95vh',
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
        maxWidth: '800px',
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
    formGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
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
    select: {
        padding: '0.75rem 1rem',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        fontSize: '1rem',
        transition: 'all 0.2s',
        backgroundColor: 'white',
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
        minHeight: '100px',
        transition: 'all 0.2s',
        ':focus': {
            outline: 'none',
            borderColor: '#3b82f6',
            boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
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
        marginTop: '1rem',
        ':hover': {
            backgroundColor: '#2563eb',
        },
    },
}

export default UzupelnijProfilUczen