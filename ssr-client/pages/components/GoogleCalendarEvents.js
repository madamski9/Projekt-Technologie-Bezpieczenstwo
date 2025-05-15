"use client"
import { useEffect, useState } from "react"
import cookies from 'js-cookie'

const CalendarEvents = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchEvents = async () => {
      const token = cookies.get('google_token')
      console.log("google token: ", token)
      if (!token) {
        setError('Brak tokenu Google w cookies')
        setLoading(false)
        return
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/google/calendar/events`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!res.ok) {
          const errData = await res.json()
          throw new Error(errData.error || JSON.stringify(errData) || 'blad api')
        }

        const data = await res.json()
        setEvents(data.items || [])
      } catch (err) {
        console.error("blad pobierania wydarzen", err)
        setError(err.message || 'nieznany blad')
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  if (loading) return <p>Ładowanie wydarzeń z Google...</p>
  if (error) return <p style={{ color: 'red' }}>Błąd: {error}</p>

  return (
    <div>
      <h2>Twoje wydarzenia z Google Kalendarza:</h2>
      {events.length === 0 ? (
        <p>Brak nadchodzących wydarzeń</p>
      ) : (
        <ul>
          {events.map(event => (
            <li key={event.id}>
              <strong>{event.summary}</strong><br />
              {event.start?.dateTime || event.start?.date} - {event.end?.dateTime || event.end?.date}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default CalendarEvents
