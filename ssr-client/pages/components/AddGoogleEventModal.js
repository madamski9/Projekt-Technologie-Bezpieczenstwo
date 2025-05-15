import React, { useState } from 'react'
import cookies from 'js-cookie'

const AddEventModal = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [title, setTitle] = useState('')
    const [start, setStart] = useState('')
    const [end, setEnd] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault();

        const startISO = new Date(start).toISOString()
        const endISO = new Date(end).toISOString()

        if (new Date(endISO) <= new Date(startISO)) {
            setError('Data zakończenia musi być późniejsza niż data rozpoczęcia')
            return
        }

        console.log("endISO: ", endISO)
        console.log("startISO: ", startISO)

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/google/calendar/add-event`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cookies.get('google_token')}`
            },
            body: JSON.stringify({
                summary: title,
                start: startISO,
                end: endISO
            })
        })

        if (!response.ok) {
            const err = await response.json()
            console.error('blad dodawania wydarzenia: ', err)
            return
        }

        setTitle('')
        setStart('')
        setEnd('')
        setIsOpen(false)
    }


    return (
        <div>
            <button className="add-button" onClick={() => setIsOpen(true)}>
                Dodaj wydarzenie
            </button>

            {isOpen && (
                <div className="modal-overlay">
                <div className="modal">
                    <div className="close-button" onClick={() => setIsOpen(false)}>
                    &times;
                    </div>
                    <h2>Dodaj nowe wydarzenie</h2>
                    <form onSubmit={handleSubmit}>
                    <label>
                        Tytuł:
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Początek:
                        <input
                            type="datetime-local"
                            value={start}
                            onChange={(e) => setStart(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Koniec:
                        <input
                            type="datetime-local"
                            value={end}
                            onChange={(e) => setEnd(e.target.value)}
                            required
                        />
                    </label>
                    <button type="submit">Dodaj</button>
                    </form>
                </div>
                </div>
            )}
        </div>
    )
}

const toISOStringWithTZ = (localDatetime) => {
  const date = new Date(localDatetime)
  return date.toISOString()
}


export default AddEventModal
