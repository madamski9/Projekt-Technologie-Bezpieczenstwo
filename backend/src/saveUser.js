import pool from './db.js'

const saveUser = async (userInfo) => {
  const { sub, email, name, picture } = userInfo

  try {
    await pool.query(
      `INSERT INTO users (sub, email, name, picture)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (sub) DO UPDATE SET email = EXCLUDED.email, name = EXCLUDED.name, picture = EXCLUDED.picture`,
      [sub, email, name, picture]
    )
    console.log("User saved to DB:", email)
  } catch (err) {
    console.error("DB error while saving user:", err)
  }
}

export default saveUser