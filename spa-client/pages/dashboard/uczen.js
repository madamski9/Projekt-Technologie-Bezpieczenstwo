import { useState, useEffect } from "react"
import cookies from 'js-cookie'

const UczenDashboard = () => {
    const [specjalizacja, setSpecjalizacja] = useState("")
    const [inniKorepetytorzy, setInniKorepetytorzy] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchTutors = async () => {
            try {
                const token = cookies.get("auth_token")
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users-tutor`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    credentials: "include",
                }) 
                if (!res.ok) throw new Error("Błąd podczas pobierania korepetytorów")
                const data = await res.json()
                console.log("data: ", data)
                setInniKorepetytorzy(data)
            } catch (err) {
                console.error(err)
                setError("Nie udało się pobrać korepetytorów.")
            } finally {
                setLoading(false)
            }
        }

        fetchTutors()
    }, [])

    // const filteredKorepetytorzy = inniKorepetytorzy.filter(k =>
    //     k.specjalizacja?.toLowerCase().includes(specjalizacja.toLowerCase())
    // )

    if (loading) return <div style={{ padding: "2rem" }}>Ładowanie danych...</div>
    if (error) return <div style={{ padding: "2rem", color: "red" }}>{error}</div>

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>Panel Ucznia</h1>
                <p style={styles.subtitle}>Znajdź korepetytora dopasowanego do Twoich potrzeb</p>
            </header>

            <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Znajdź korepetytora</h2>
                <input
                    type="text"
                    placeholder="Szukaj po specjalizacji..."
                    value={specjalizacja}
                    onChange={(e) => setSpecjalizacja(e.target.value)}
                    style={styles.searchInput}
                />
                <div style={styles.cardContainer}>
                    {inniKorepetytorzy
                        .filter(k => 
                        specjalizacja === "" || 
                        k.specjalizacja?.toLowerCase().includes(specjalizacja.toLowerCase())
                        )
                        .map(k => (
                        <div key={k.sub} style={styles.card}>
                            <div style={styles.avatar}>{k.username?.charAt(0).toUpperCase() || "?"}</div>
                            <div style={styles.cardContent}>
                            <h3 style={styles.cardTitle}>{k.username}</h3>
                            <p style={styles.cardText}>{k.specjalizacja || "-"}</p>
                            <p style={styles.cardText}>Cena: {k.cena} PLN</p>
                            <p style={styles.cardText}>Lokalizacja: {k.lokalizacja}</p>
                            </div>
                            <button style={styles.primaryButton}>Dodaj</button>
                        </div>
                        ))
                    }
                </div>
            </section>
        </div>
    )
}


const styles = {
    container: {
        maxWidth: 1200,
        margin: '0 auto',
        padding: '2rem',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: '#333',
    },
    header: {
        marginBottom: '3rem',
        textAlign: 'center',
    },
    title: {
        fontSize: '2.5rem',
        color: '#2c3e50',
        marginBottom: '0.5rem',
    },
    subtitle: {
        fontSize: '1.1rem',
        color: '#7f8c8d',
    },
    section: {
        marginBottom: '3rem',
    },
    sectionTitle: {
        fontSize: '1.8rem',
        color: '#2c3e50',
        marginBottom: '1.5rem',
        paddingBottom: '0.5rem',
        borderBottom: '2px solid #ecf0f1',
    },
    cardContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.5rem',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        transition: 'transform 0.2s',
        ':hover': {
            transform: 'translateY(-5px)',
        },
    },
    avatar: {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        backgroundColor: '#3498db',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        marginRight: '1rem',
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: '1.2rem',
        margin: '0 0 0.3rem 0',
        color: '#2c3e50',
    },
    cardText: {
        fontSize: '0.9rem',
        color: '#7f8c8d',
        margin: 0,
    },
    searchInput: {
        padding: '0.8rem 1rem',
        width: '100%',
        maxWidth: '500px',
        marginBottom: '2rem',
        borderRadius: '8px',
        border: '1px solid #ddd',
        fontSize: '1rem',
        outline: 'none',
        transition: 'border 0.3s',
        ':focus': {
            border: '1px solid #3498db',
        },
    },
    primaryButton: {
        backgroundColor: '#3498db',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        padding: '0.6rem 1rem',
        cursor: 'pointer',
        fontSize: '0.9rem',
        fontWeight: '600',
        transition: 'background-color 0.2s',
        ':hover': {
            backgroundColor: '#2980b9',
        },
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        color: '#3498db',
        border: '1px solid #3498db',
        borderRadius: '6px',
        padding: '0.6rem 1rem',
        cursor: 'pointer',
        fontSize: '0.9rem',
        fontWeight: '600',
        transition: 'all 0.2s',
        ':hover': {
            backgroundColor: '#f8f9fa',
        },
    },
}

export default UczenDashboard