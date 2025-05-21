import { GraduationCap, BookOpen, MapPin, Clock, Edit3 } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/router'

const UzupelnijProfilKorepetytor = () => {
    const router = useRouter()
    const [formData, setFormData] = useState({
        specjalizacja: '',
        opis: '',
        przedmioty: [],
        cena: '',
        lokalizacja: '',
        dostepnosc: ''
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
        console.log('Form data submitted:', formData)
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/add-tutor`, {
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
            <div style={styles.header}>
                <h1 style={styles.title}>Uzupełnij swój profil</h1>
                <p style={styles.subtitle}>Dokończ konfigurację konta, aby móc oferować korepetycje</p>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGrid}>
                    <div style={styles.mainColumn}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                <GraduationCap size={18} style={styles.icon} />
                                Specjalizacja
                            </label>
                            <input
                                type="text"
                                name="specjalizacja"
                                value={formData.specjalizacja}
                                onChange={handleChange}
                                placeholder="np. Matematyka, Fizyka"
                                style={styles.input}
                                required
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                <Edit3 size={18} style={styles.icon} />
                                Opis
                            </label>
                            <textarea
                                name="opis"
                                value={formData.opis}
                                onChange={handleChange}
                                placeholder="Opisz swoje doświadczenie, podejście do nauczania itp."
                                style={styles.textarea}
                                rows={6}
                                required
                            />
                        </div>
                    </div>

                    <div style={styles.sideColumn}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                <BookOpen size={18} style={styles.icon} />
                                Przedmioty
                            </label>
                            <input
                                type="text"
                                name="przedmioty"
                                value={formData.przedmioty.join(', ')}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    przedmioty: e.target.value.split(',').map(item => item.trim())
                                })}
                                placeholder="np. Matematyka, Fizyka, Chemia"
                                style={styles.input}
                                required
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                Cena za godzinę
                            </label>
                            <div style={styles.priceInput}>
                                <input
                                    type="number"
                                    name="cena"
                                    value={formData.cena}
                                    onChange={handleChange}
                                    placeholder="np. 50"
                                    style={styles.input}
                                    required
                                />
                                <span style={styles.currency}>PLN</span>
                            </div>
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

                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                <Clock size={18} style={styles.icon} />
                                Dostępność
                            </label>
                            <input
                                type="text"
                                name="dostepnosc"
                                value={formData.dostepnosc}
                                onChange={handleChange}
                                placeholder="np. Pon-Pt 16:00-20:00"
                                style={styles.input}
                                required
                            />
                        </div>
                    </div>
                </div>

                <div style={styles.footer}>
                    <button type="submit" style={styles.submitButton}>
                        Zapisz profil
                    </button>
                </div>
            </form>
        </div>
    )
}

const styles = {
    container: {
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '2rem 1rem',
        fontFamily: "'Inter', sans-serif",
    },
    header: {
        marginBottom: '2.5rem',
        textAlign: 'center',
    },
    title: {
        fontSize: '2rem',
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: '0.5rem',
    },
    subtitle: {
        fontSize: '1rem',
        color: '#64748b',
    },
    form: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    },
    formGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem',
        '@media (max-width: 768px)': {
            gridTemplateColumns: '1fr',
        },
    },
    mainColumn: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
    },
    sideColumn: {
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
        transition: 'border-color 0.2s',
        ':focus': {
            outline: 'none',
            borderColor: '#3b82f6',
        },
    },
    textarea: {
        padding: '0.75rem 1rem',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        fontSize: '1rem',
        resize: 'vertical',
        minHeight: '150px',
        transition: 'border-color 0.2s',
        ':focus': {
            outline: 'none',
            borderColor: '#3b82f6',
        },
    },
    priceInput: {
        position: 'relative',
    },
    currency: {
        position: 'absolute',
        right: '1rem',
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#64748b',
    },
    footer: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: '2rem',
    },
    submitButton: {
        backgroundColor: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        padding: '0.75rem 2rem',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        ':hover': {
            backgroundColor: '#2563eb',
        },
    },
}

export default UzupelnijProfilKorepetytor