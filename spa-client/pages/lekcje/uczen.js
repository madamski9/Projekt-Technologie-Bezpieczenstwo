import GoogleConnectButton from "../components/GoogleConnectButton"
import GoogleCalendarEvents from "../components/GoogleCalendarEvents"
import AddGoogleEventModal from "../components/AddGoogleEventModal"
import { useState } from "react"

const UczenDashboard = () => {
    const [refresh, setRefresh] = useState(0)

    const handleRefreshEvents = () => {
        setRefresh(prev => prev + 1) 
    }
    const handleLogout = async () => {
        return window.location.href = process.env.NEXT_PUBLIC_LOGOUT_URL
    }

    return (
        <div style={{ padding: 40 }}>
            <h1>Panel Ucznia</h1>
            <p>Tu znajdziesz swoich korepetytorów, zaplanowane lekcje i materiały do nauki.</p>
            <GoogleConnectButton />
            <GoogleCalendarEvents refreshTrigger={refresh} />
            <AddGoogleEventModal onEventAdded={handleRefreshEvents} />
            <button
                onClick={(e) => handleLogout(e)}
            >
                Logout
            </button>
        </div>
    )
}

export default UczenDashboard