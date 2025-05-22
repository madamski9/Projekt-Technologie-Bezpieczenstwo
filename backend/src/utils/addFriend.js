import pool from '../config/db.js'

export const addFriendStudent = async (studentId, friendId) => {
  const userCheck = await pool.query('SELECT sub FROM student_profiles WHERE sub = $1', [studentId])
  if (userCheck.rowCount === 0) {
    throw new Error('Użytkownik nie znaleziony')
  }

  const znajomi = userCheck.rows[0].znajomi || []

  if (znajomi.includes(friendId)) {
    throw new Error('Znajomy już istnieje')
  }

  const query = `
    UPDATE student_profiles
    SET znajomi = ARRAY(
      SELECT DISTINCT elem
      FROM unnest(ARRAY_REMOVE(COALESCE(znajomi, '{}'), NULL) || ARRAY[$2::uuid]) AS elem
    )
    WHERE sub = $1
    RETURNING *
  `

  const values = [studentId, friendId]

  const { rows } = await pool.query(query, values)

  if (rows.length === 0) {
    throw new Error('Aktualizacja nie powiodła się')
  }

  return rows[0]
}

export const addFriendTutor = async (tutorId, friendId) => {
  const userCheck = await pool.query('SELECT sub FROM tutor_profiles WHERE sub = $1', [tutorId])
  if (userCheck.rowCount === 0) {
    throw new Error('Użytkownik nie znaleziony')
  }

  const znajomi = userCheck.rows[0].znajomi || []

  if (znajomi.includes(friendId)) {
    throw new Error('Znajomy już istnieje')
  }

  const query = `
    UPDATE tutor_profiles
    SET znajomi = ARRAY(
      SELECT DISTINCT elem
      FROM unnest(ARRAY_REMOVE(COALESCE(znajomi, '{}'), NULL) || ARRAY[$2::uuid]) AS elem
    )
    WHERE sub = $1
    RETURNING *
  `

  const values = [tutorId, friendId]

  const { rows } = await pool.query(query, values)

  if (rows.length === 0) {
    throw new Error('Aktualizacja nie powiodła się')
  }

  return rows[0]
}