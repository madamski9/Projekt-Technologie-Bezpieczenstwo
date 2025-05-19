import GoogleConnectButton from "../../components/GoogleConnectButton"
import GoogleCalendarEvents from "../../components/GoogleCalendarEvents"
import AddGoogleEventModal from "../../components/AddGoogleEventModal"
import { useState } from "react"

const UczenDashboard = () => {
    const [refresh, setRefresh] = useState(0)

    const handleRefreshEvents = () => {
        setRefresh(prev => prev + 1) 
    }

    return (
        <div style={{ padding: 40 }}>
            <h1>Panel Ucznia</h1>
            <p>Tu znajdziesz swoich korepetytorów, zaplanowane lekcje i materiały do nauki.</p>
            <GoogleConnectButton />
            <GoogleCalendarEvents refreshTrigger={refresh} />
            <AddGoogleEventModal onEventAdded={handleRefreshEvents} />
        </div>
    )
}

export default UczenDashboard