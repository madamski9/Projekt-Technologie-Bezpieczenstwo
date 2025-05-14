const UczenDashboard = () => {
    const handleLogout = async () => {
        return window.location.href = process.env.NEXT_PUBLIC_LOGOUT_URL
    }

    return (
        <div style={{ padding: 40 }}>
            <h1>Panel Ucznia</h1>
            <p>Tu znajdziesz swoich korepetytorów, zaplanowane lekcje i materiały do nauki.</p>
            <button
                onClick={(e) => handleLogout(e)}
            >
                Logout
            </button>
        </div>
    )
}

export default UczenDashboard