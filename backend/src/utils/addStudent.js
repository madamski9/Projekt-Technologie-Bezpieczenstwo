import pool from '../config/db.js'

const addStudent = async (sub, formData) => {
    const {
        poziom,
        cele,
        preferencje,
        lokalizacja,
        opis
    } = formData

    const result = await pool.query(`
        INSERT INTO student_profiles 
        (sub, poziom, lokalizacja, opis)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (sub)
        DO UPDATE SET
            poziom = EXCLUDED.poziom,
            lokalizacja = EXCLUDED.lokalizacja,
            opis = EXCLUDED.opis
        RETURNING *
    `, [
        sub,
        poziom,
        lokalizacja,
        opis,
    ])

    return result.rows[0]
}

export default addStudent
