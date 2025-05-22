import { useState, useEffect } from "react"
import cookies from 'js-cookie'

const UczenDashboard = () => {
    const [specjalizacja, setSpecjalizacja] = useState("")
    const [inniKorepetytorzy, setInniKorepetytorzy] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [znajomi, setZnajomi] = useState([])
    
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
            setInniKorepetytorzy(data)
        } catch (err) {
            console.error(err)
            setError("Nie udało się pobrać korepetytorów.")
        }
    }

    const fetchFriends = async () => {
        try {
            const token = cookies.get("auth_token")
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/fetch-friends`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                credentials: "include",
            })
            if (!res.ok) throw new Error("Błąd podczas pobierania znajomych")
            const data = await res.json()
            console.log("data: ", data)
            setZnajomi(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleRemoveFriend = async (e, sub) => {
        e.preventDefault()
        try {
            const token = cookies.get("auth_token")
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/delete-friend/${sub}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                credentials: 'include',
            })
            console.log("RES: ", res)
            if (!res.ok) throw new Error("Nie udało się usunąć znajomego.")
            const removedFriend = znajomi.find(friend => friend.sub === sub)
        
            alert("Znajomy usunięty!")
            setZnajomi(prev => prev.filter(friend => friend.sub !== sub))
            if (removedFriend) {
                setInniKorepetytorzy(prev => [...prev, removedFriend])
            }
        } catch (err) {
            console.error(err)
            alert("Błąd podczas usuwania znajomego.")
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            await Promise.all([fetchTutors(), fetchFriends()])
        }
        fetchData()
    }, [])

    const handleAddToFriends = async (e, tutorId) => {
        e.preventDefault()
        try {
            const token = cookies.get("auth_token")
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/friends`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ tutorId }),
                credentials: 'include',
            })
            
            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData.message || "Nie udało się dodać korepetytora.")
            }
            
            const addedTutor = inniKorepetytorzy.find(k => k.sub === tutorId)
            if (addedTutor) {
                setZnajomi(prev => [...prev, addedTutor])
                setInniKorepetytorzy(prev => prev.filter(k => k.sub !== tutorId))
            }
            
            alert("Korepetytor dodany do znajomych!")
        } catch (err) {
            console.error(err)
            alert(err.message || "Błąd podczas dodawania korepetytora.")
        }
    }

    console.log("korepetytorzy: ", inniKorepetytorzy)
    if (loading) return <div style={{ padding: "2rem" }}>Ładowanie danych...</div>
    if (error) return <div style={{ padding: "2rem", color: "red" }}>{error}</div>

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>Panel Ucznia</h1>
                <p style={styles.subtitle}>Znajdź korepetytora dopasowanego do Twoich potrzeb</p>
            </header>

            {znajomi.length > 0 && (
                <section style={styles.section}>
                    <h2 style={styles.sectionTitle}>Moi Korepetytorzy</h2>
                    <div style={styles.cardContainer}>
                        {znajomi.map(k => (
                            <div key={k.sub} style={{...styles.card, borderLeft: '4px solid #2ecc71'}}>
                                <div style={{...styles.avatar, backgroundColor: '#2ecc71'}}>
                                    {k.name?.charAt(0).toUpperCase() || "?"}
                                </div>
                                <div style={styles.cardContent}>
                                    <h3 style={styles.cardTitle}>{k.name}</h3>
                                    <p style={styles.cardText}>{k.specjalizacja || "-"}</p>
                                    <p style={styles.cardText}>Cena: {k.cena} PLN</p>
                                    <p style={styles.cardText}>Lokalizacja: {k.lokalizacja}</p>
                                </div>
                                <button 
                                    style={styles.dangerButton}
                                    onClick={(e) => handleRemoveFriend(e, k.sub)}
                                >
                                    Usuń
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            )}

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
                                <div style={styles.avatar}>
                                    {k.name?.charAt(0).toUpperCase() || "?"}
                                </div>
                                <div style={styles.cardContent}>
                                    <h3 style={styles.cardTitle}>{k.name}</h3>
                                    <p style={styles.cardText}>{k.specjalizacja || "-"}</p>
                                    <p style={styles.cardText}>Cena: {k.cena} PLN</p>
                                    <p style={styles.cardText}>Lokalizacja: {k.lokalizacja}</p>
                                </div>
                                <button 
                                    style={styles.primaryButton}
                                    onClick={(e) => handleAddToFriends(e, k.sub)}
                                >
                                    Dodaj
                                </button>
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
        position: 'relative',
        overflow: 'hidden',
    },
    avatar: {
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        backgroundColor: '#3498db',
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
    searchInput: {
        padding: '0.8rem 1rem',
        width: '100%',
        maxWidth: '500px',
        marginBottom: '2rem',
        borderRadius: '8px',
        border: '1px solid #ddd',
        fontSize: '1rem',
        outline: 'none',
        transition: 'border 0.3s, box-shadow 0.3s',
        ':focus': {
            border: '1px solid #3498db',
            boxShadow: '0 0 0 3px rgba(52, 152, 219, 0.2)',
        },
    },
    primaryButton: {
        backgroundColor: '#3498db',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        padding: '0.7rem 1rem',
        cursor: 'pointer',
        fontSize: '0.9rem',
        fontWeight: '600',
        transition: 'background-color 0.2s',
        width: '100%',
        ':hover': {
            backgroundColor: '#2980b9',
        },
    },
    dangerButton: {
        backgroundColor: '#e74c3c',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        padding: '0.7rem 1rem',
        cursor: 'pointer',
        fontSize: '0.9rem',
        fontWeight: '600',
        transition: 'background-color 0.2s',
        width: '100%',
        ':hover': {
            backgroundColor: '#c0392b',
        },
    },
}

export default UczenDashboard