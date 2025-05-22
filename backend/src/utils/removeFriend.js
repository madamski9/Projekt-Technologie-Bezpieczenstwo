import pool from '../config/db.js'

export const removeFriendFromStudent = async (studentId, friendId) => {
  const result = await pool.query(
    `UPDATE student_profiles
     SET znajomi = array_remove(znajomi, $1::uuid)
     WHERE sub = $2`,
    [friendId, studentId]
  )
  return result.rowCount
}

export const removeFriendFromTutor = async (tutorId, friendId) => {
  const result = await pool.query(
    `UPDATE tutor_profiles
     SET znajomi = array_remove(znajomi, $1::uuid)
     WHERE sub = $2`,
    [friendId, tutorId]
  )
  return result.rowCount
}