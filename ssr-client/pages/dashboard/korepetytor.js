import GoogleConnectButton from "../components/GoogleConnectButton"

const KorepetytorDashboard = () => {
    const handleLogout = async () => {
        return window.location.href = process.env.NEXT_PUBLIC_LOGOUT_URL
    }

    return (
        <div style={{ padding: 40 }}>
            <h1>Panel Korepetytora</h1>
            <p>Tu widzisz swoich uczniów, nadchodzące lekcje, i możesz zarządzać swoim grafikiem.</p>
            <button
                onClick={(e) => handleLogout(e)}
            >
                Logout
            </button>
            <GoogleConnectButton />
        </div>
    )
}

export default KorepetytorDashboard