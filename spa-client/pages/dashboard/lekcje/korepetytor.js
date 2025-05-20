import GoogleConnectButton from "../../components/GoogleConnectButton"
import GoogleCalendarEvents from "../../components/GoogleCalendarEvents"
import AddGoogleEventModal from "../../components/AddGoogleEventModal"

const KorepetytorLessons = () => {
    const handleRefreshEvents = () => {
        setRefresh(prev => prev + 1) 
    }

    return (
        <div style={{ padding: 40 }}>
            <h1>Panel Korepetytora</h1>
            <p>Tu widzisz swoich uczniów, nadchodzące lekcje, i możesz zarządzać swoim grafikiem.</p>
            <GoogleConnectButton />
            <GoogleCalendarEvents />
            <AddGoogleEventModal onEventAdded={handleRefreshEvents} />
        </div>
    )
}

export default KorepetytorLessons