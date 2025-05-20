import GoogleConnectButton from "../../components/GoogleConnectButton"
import GoogleCalendarEvents from "../../components/GoogleCalendarEvents"
import AddGoogleEventModal from "../../components/AddGoogleEventModal"
import { useState } from "react"

const UczenLessons = () => {
    const [refresh, setRefresh] = useState(0)

    const handleRefreshEvents = () => {
        setRefresh(prev => prev + 1)
    }

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>Plan Lekcji</h1>
                <p style={styles.subtitle}>Zarządzaj swoimi zajęciami i kalendarzem w jednym miejscu</p>
            </header>

            <div style={styles.controls}>
                <GoogleConnectButton style={styles.button} />
                <AddGoogleEventModal onEventAdded={handleRefreshEvents} />
            </div>

            <GoogleCalendarEvents refreshTrigger={refresh} />
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
        marginBottom: '2rem',
    },
    title: {
        fontSize: '2.2rem',
        color: '#2c3e50',
        marginBottom: '0.5rem',
    },
    subtitle: {
        fontSize: '1rem',
        color: '#7f8c8d',
    },
    controls: {
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem',
        alignItems: 'center',
    },
    button: {
        padding: '0.8rem 1.5rem',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: '#4285F4',
        color: 'white',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
    }
}

export default UczenLessons