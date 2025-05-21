import pool from '../config/db.js'

const addTutor = async (sub, formData) => {
    const {
        specjalizacja,
        opis,
        przedmioty,
        cena,
        lokalizacja,
        dostepnosc
    } = formData

    const result = await pool.query(`
        INSERT INTO tutor_profiles 
        (sub, specjalizacja, opis, przedmioty, cena, lokalizacja, dostepnosc)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (sub)
        DO UPDATE SET
            specjalizacja = EXCLUDED.specjalizacja,
            opis = EXCLUDED.opis,
            przedmioty = EXCLUDED.przedmioty,
            cena = EXCLUDED.cena,
            lokalizacja = EXCLUDED.lokalizacja,
            dostepnosc = EXCLUDED.dostepnosc
        RETURNING *
    `, [
        sub,
        specjalizacja,
        opis,
        przedmioty,
        cena,
        lokalizacja,
        dostepnosc,
    ])

    return result.rows[0]
}

export default addTutor
