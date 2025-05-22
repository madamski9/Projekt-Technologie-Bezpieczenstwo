import pool from '../config/db.js'

export const fetchFriendsStudent = async (studentId) => {
  const result = await pool.query(
    'SELECT znajomi FROM student_profiles WHERE sub = $1',
    [studentId]
  )

  if (result.rows.length === 0) throw new Error('Użytkownik nie znaleziony')

  const friendsUuids = result.rows[0].znajomi || []
  if (friendsUuids.length === 0) return []

  const friends = await pool.query(
    `SELECT 
      t.sub,
      u.name,
      t.specjalizacja,
      t.cena,
      t.lokalizacja,
      t.przedmioty,
      t.opis,
      t.dostepnosc
    FROM tutor_profiles t
    JOIN users u ON u.sub = t.sub::text
    WHERE t.sub = ANY($1::uuid[])`,
    [friendsUuids]
  )

  return friends.rows
}

export const fetchFriendsTutor = async (tutorId) => {
  const result = await pool.query(
    'SELECT znajomi FROM tutor_profiles WHERE sub = $1',
    [tutorId]
  )

  if (result.rows.length === 0) throw new Error('Użytkownik nie znaleziony')

  const friendsUuids = result.rows[0].znajomi || []
  if (friendsUuids.length === 0) return []

  const friends = await pool.query(
    `SELECT 
      s.sub,
      u.name,
      s.poziom,
      s.lokalizacja,
      s.opis
    FROM student_profiles s
    JOIN users u ON u.sub = s.sub
    WHERE s.sub = ANY($1::text[])`,
    [friendsUuids.map(uuid => uuid.toString())] 
  )


  return friends.rows
}

