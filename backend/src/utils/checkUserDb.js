import pool from '../config/db.js'

const checkUser = async (userId) => {
    try {
        const user = await pool.query('SELECT * FROM users WHERE sub = $1', [userId])
        return user.rows.length > 0 ? user.rows[0] : null
    } catch (err) {
        console.error("DB error while checking user:", err)
        throw err
    }
}

export default checkUser
