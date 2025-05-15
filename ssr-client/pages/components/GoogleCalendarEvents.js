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
    <div style={{ maxWidth: '100%', overflowX: 'auto' }}>
        <h2>Twoje wydarzenia z Google Kalendarza:</h2>
        {events.length === 0 ? (
            <p>Brak nadchodzących wydarzeń</p>
        ) : (
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '600px' }}>
            <thead>
                <tr>
                    <th style={thStyle}>Nazwa</th>
                    <th style={thStyle}>Data i godzina startu</th>
                    <th style={thStyle}>Data i godzina zakończenia</th>
                    <th style={thStyle}>Opis</th>
                </tr>
            </thead>
            <tbody>
                {events.map(event => (
                    <tr key={event.id} style={{ borderBottom: '1px solid #ddd' }}>
                        <td style={tdStyle}>{event.summary || 'Brak nazwy'}</td>
                        <td style={tdStyle}>{event.start?.dateTime || event.start?.date || 'Brak'}</td>
                        <td style={tdStyle}>{event.end?.dateTime || event.end?.date || 'Brak'}</td>
                        <td style={tdStyle}>{event.description || '-'}</td>
                    </tr>
                ))}
            </tbody>
            </table>
        )}
    </div>
  )
}

const thStyle = {
    border: '1px solid #ddd',
    padding: '8px',
    backgroundColor: '#f2f2f2',
    textAlign: 'left',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
}

const tdStyle = {
    border: '1px solid #ddd',
    padding: '8px',
}

export default CalendarEvents
