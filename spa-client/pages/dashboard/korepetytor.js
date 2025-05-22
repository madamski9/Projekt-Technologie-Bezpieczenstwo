import { useState, useEffect } from "react"
import cookies from 'js-cookie'
import { useRouter } from "next/router"

const KorepetytorDashboard = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [studenci, setStudenci] = useState([])
    
    const fetchStudents = async () => {
        try {
            const token = cookies.get("auth_token")
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/fetch-friends`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                credentials: "include",
            })
            
            if (!res.ok) throw new Error("Błąd podczas pobierania studentów")
            
            const data = await res.json()
            console.log("DATA: ", data)
            setStudenci(data)
        } catch (err) {
            console.error(err)
            setError("Nie udało się pobrać listy studentów")
        } finally {
            setLoading(false)
        }
    }

    const handleClick = () => {
        try {
            const token = cookies.get("google_token")
            if (token) {
                router.push("./lekcje/korepetytor?action=openModal")
            } else {
                alert("Najpierw połącz się z Google kalendarzem")
                router.push("./lekcje/korepetytor")
            }
        } catch (e) {
            console.error("cant get google token: ", e)
        }
    }

    useEffect(() => {
        fetchStudents()
    }, [])

    if (loading) return <div style={{ padding: "2rem" }}>Ładowanie danych...</div>
    if (error) return <div style={{ padding: "2rem", color: "red" }}>{error}</div>

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>Panel Korepetytora</h1>
                <p style={styles.subtitle}>Twoi uczniowie i zarządzanie lekcjami</p>
            </header>

            <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Moi Uczniowie</h2>
                {studenci.length === 0 ? (
                    <p style={styles.emptyMessage}>Nie masz jeszcze żadnych uczniów</p>
                ) : (
                    <div style={styles.cardContainer}>
                        {studenci.map(student => (
                            <div key={student.sub} style={{...styles.card, borderLeft: '4px solid #9b59b6'}}>
                                <div style={{...styles.avatar, backgroundColor: '#9b59b6'}}>
                                    {student.name?.charAt(0).toUpperCase() || "U"}
                                </div>
                                <div style={styles.cardContent}>
                                    <h3 style={styles.cardTitle}>{student.name}</h3>
                                    <p style={styles.cardText}>Lokalizacja: {student.lokalizacja || "-"}</p>
                                    <p style={styles.cardText}>Poziom: {student.poziom || "-"}</p>
                                </div>
                                <div style={styles.buttonGroup}>
                                    <button 
                                        style={styles.primaryButton}
                                        onClick={(e) => handleClick(e)}
                                        >
                                        Umów lekcję
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
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
        backgroundColor: '#f8f9fa',
        padding: '2rem',
        borderRadius: '10px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    },
    sectionTitle: {
        fontSize: '1.8rem',
        color: '#2c3e50',
        marginBottom: '1.5rem',
        paddingBottom: '0.5rem',
        borderBottom: '2px solid #ecf0f1',
    },
    emptyMessage: {
        textAlign: 'center',
        color: '#7f8c8d',
        fontStyle: 'italic',
    },
    cardContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.5rem',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        ':hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        },
    },
    avatar: {
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        marginBottom: '1rem',
        alignSelf: 'center',
    },
    cardContent: {
        flex: 1,
        marginBottom: '1rem',
    },
    cardTitle: {
        fontSize: '1.2rem',
        margin: '0 0 0.5rem 0',
        color: '#2c3e50',
        textAlign: 'center',
    },
    cardText: {
        fontSize: '0.9rem',
        color: '#7f8c8d',
        margin: '0.3rem 0',
        padding: '0.2rem 0',
        borderBottom: '1px solid #f0f0f0',
    },
    buttonGroup: {
        display: 'flex',
        gap: '0.5rem',
    },
    primaryButton: {
        backgroundColor: '#9b59b6',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        padding: '0.7rem 1rem',
        cursor: 'pointer',
        fontSize: '0.9rem',
        fontWeight: '600',
        transition: 'background-color 0.2s',
        flex: 1,
        ':hover': {
            backgroundColor: '#8e44ad',
        },
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        color: '#9b59b6',
        border: '1px solid #9b59b6',
        borderRadius: '6px',
        padding: '0.7rem 1rem',
        cursor: 'pointer',
        fontSize: '0.9rem',
        fontWeight: '600',
        transition: 'all 0.2s',
        flex: 1,
        ':hover': {
            backgroundColor: '#f8f9fa',
        },
    },
}

export default KorepetytorDashboard