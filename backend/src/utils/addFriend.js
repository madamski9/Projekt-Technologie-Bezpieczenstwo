import pool from '../config/db.js'

export const addFriendStudent = async (studentId, friendId) => {
  const studentRes = await pool.query('SELECT znajomi FROM student_profiles WHERE sub = $1', [studentId])
  if (studentRes.rowCount === 0) throw new Error('Użytkownik (uczeń) nie znaleziony')

  const znajomiStudent = studentRes.rows[0].znajomi || []
  if (znajomiStudent.includes(friendId)) throw new Error('Znajomy już istnieje')

  await pool.query(`
    UPDATE student_profiles
    SET znajomi = ARRAY(
      SELECT DISTINCT elem
      FROM unnest(COALESCE(znajomi, '{}') || ARRAY[$2::uuid]) AS elem
    )
    WHERE sub = $1
  `, [studentId, friendId])

  const tutorRes = await pool.query('SELECT znajomi FROM tutor_profiles WHERE sub = $1', [friendId])
  if (tutorRes.rowCount > 0) {
    const znajomiTutor = tutorRes.rows[0].znajomi || []
    if (!znajomiTutor.includes(studentId)) {
      await pool.query(`
        UPDATE tutor_profiles
        SET znajomi = ARRAY(
          SELECT DISTINCT elem
          FROM unnest(COALESCE(znajomi, '{}') || ARRAY[$1::uuid]) AS elem
        )
        WHERE sub = $2
      `, [studentId, friendId])
    }
  }

  return { message: 'Znajomy dodany obustronnie' }
}

export const addFriendTutor = async (tutorId, friendId) => {
  const tutorRes = await pool.query('SELECT znajomi FROM tutor_profiles WHERE sub = $1', [tutorId])
  if (tutorRes.rowCount === 0) throw new Error('Użytkownik (tutor) nie znaleziony')

  const znajomiTutor = tutorRes.rows[0].znajomi || []
  if (znajomiTutor.includes(friendId)) throw new Error('Znajomy już istnieje')

  await pool.query(`
    UPDATE tutor_profiles
    SET znajomi = ARRAY(
      SELECT DISTINCT elem
      FROM unnest(COALESCE(znajomi, '{}') || ARRAY[$2::uuid]) AS elem
    )
    WHERE sub = $1
  `, [tutorId, friendId])

  const studentRes = await pool.query('SELECT znajomi FROM student_profiles WHERE sub = $1', [friendId])
  if (studentRes.rowCount > 0) {
    const znajomiStudent = studentRes.rows[0].znajomi || []
    if (!znajomiStudent.includes(tutorId)) {
      await pool.query(`
        UPDATE student_profiles
        SET znajomi = ARRAY(
          SELECT DISTINCT elem
          FROM unnest(COALESCE(znajomi, '{}') || ARRAY[$1::uuid]) AS elem
        )
        WHERE sub = $2
      `, [tutorId, friendId])
    }
  }

  return { message: 'Znajomy dodany obustronnie' }
}
