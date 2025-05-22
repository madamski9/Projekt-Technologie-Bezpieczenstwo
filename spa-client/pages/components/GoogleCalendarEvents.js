"use client"
import { useEffect, useState } from "react"
import cookies from 'js-cookie'
import { Trash2, Loader2, Calendar, Clock, AlertCircle } from 'lucide-react'
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
    <div style={styles.loading}>
      <Loader2 size={24} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
      <p>Ładowanie wydarzeń...</p>
    </div>
  )

  if (error) return (
    <div style={styles.error}>
      <AlertCircle size={20} />
      <p>{error}</p>
    </div>
  )

  return (
    <div style={styles.eventsContainer}>
      <h2 style={styles.eventsTitle}>Nadchodzące zajęcia</h2>

      {events.length === 0 ? (
        <div style={styles.emptyState}>
          <Calendar size={48} color="#7f8c8d" />
          <p>Brak nadchodzących wydarzeń</p>
        </div>
      ) : (
        <div style={styles.eventsGrid}>
          {events.map(event => (
            <div key={event.id} style={styles.eventCard}>
              <div style={styles.eventHeader}>
                <h3 style={styles.eventTitle}>{event.summary || 'Brak nazwy'}</h3>
                <button 
                  style={styles.deleteButton} 
                  onClick={() => handleDelete(event.id)}
                  title="Usuń wydarzenie"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              
              <div style={styles.eventTime}>
                <Clock size={16} />
                <span>
                  {formatDateTime(event.start?.dateTime || event.start?.date)} - {' '}
                  {formatDateTime(event.end?.dateTime || event.end?.date)}
                </span>
              </div>
              
              {event.description && (
                <p style={styles.eventDescription}>
                  {event.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const styles = {
  eventsContainer: {
    marginTop: '2rem',
  },
  eventsTitle: {
    fontSize: '1.5rem',
    color: '#2c3e50',
    marginBottom: '1.5rem',
  },
  loading: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    color: '#7f8c8d',
  },
  error: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#e74c3c',
    padding: '1rem',
    backgroundColor: '#fdecea',
    borderRadius: '8px',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    padding: '3rem',
    color: '#7f8c8d',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    textAlign: 'center',
  },
  eventsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  eventCard: {
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    padding: '1.5rem',
    transition: 'transform 0.2s, box-shadow 0.2s',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
  },
  eventHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
  },
  eventTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#2c3e50',
    margin: 0,
  },
  deleteButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#e74c3c',
    padding: '0.25rem',
    borderRadius: '4px',
    ':hover': {
      backgroundColor: '#fdecea',
    },
  },
  eventTime: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#7f8c8d',
    fontSize: '0.9rem',
    marginBottom: '0.5rem',
  },
  eventDescription: {
    color: '#34495e',
    fontSize: '0.9rem',
    lineHeight: '1.5',
    margin: 0,
  },
}

export default CalendarEvents