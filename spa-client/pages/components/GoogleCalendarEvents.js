"use client"
import { useEffect, useState } from "react"
import cookies from 'js-cookie'
import { Trash2 } from 'lucide-react'
import formatDateTime from "../utils/formatDateTime"

const CalendarEvents = ({ refreshTrigger }) => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchEvents = async () => {
    const token = cookies.get('google_token')
    if (!token) {
      setError('Połącz się z Google Kalendarzem!')
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
          throw new Error(errData.error || JSON.stringify(errData) || 'błąd API')
      }

      const data = await res.json()
      setEvents(data.items || [])
    } catch (err) {
      setError(err.message || 'Nieznany błąd')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [refreshTrigger])

  const handleDelete = async (eventId) => {
    const confirmed = window.confirm("Czy na pewno chcesz usunąć to wydarzenie?")
    if (!confirmed) return

    const token = cookies.get('google_token')
    if (!token) {
      alert('Brak tokenu Google')
      return
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/google/calendar/delete-event/${eventId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (!res.ok) {
        const err = await res.json()
        alert(`Błąd usuwania: ${err.error || 'Nieznany błąd'}`)
        return
      }

      fetchEvents()
    } catch (err) {
      console.error(err)
      alert('Wewnętrzny błąd serwera')
    }
  }

  if (loading) return (
    <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Ładowanie wydarzeń z Google...</p>
    </div>
  )
  if (error) return <p style={{ color: 'red' }}>{error}</p>

  return (
    <div style={{ maxWidth: '100%', overflowX: 'auto', marginBottom: 20 }}>
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
                    <tr key={event.id}>
                        <td style={tdStyle}>{event.summary || 'Brak nazwy'}</td>
                        <td style={tdStyle}>{formatDateTime(event.start?.dateTime || event.start?.date)}</td>
                        <td style={tdStyle}>{formatDateTime(event.end?.dateTime || event.end?.date)}</td>
                        <td style={tdStyle}>{event.description || '-'}</td>
                        <td style={{ textAlign: 'left' }}>
                          <button 
                            style={{ background: 'none', border: 'none', cursor: 'pointer' }} 
                            onClick={() => handleDelete(event.id)}
                            title="Usuń wydarzenie"
                          >
                            <Trash2 color="black" size={23}/>
                          </button>
                        </td>
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
    borderBottom: '1px solid #ddd'
}

export default CalendarEvents
