import React, { useState, useEffect } from 'react'
import cookies from 'js-cookie'

const AddEventModal = ({ isOpen: controlledIsOpen, onClose, onEventAdded }) => {
    const [internalIsOpen, setInternalIsOpen] = useState(false)
    const isControlled = controlledIsOpen !== undefined
    const isOpen = isControlled ? controlledIsOpen : internalIsOpen

    const [title, setTitle] = useState('')
    const [start, setStart] = useState('')
    const [description, setDescription] = useState('')
    const [end, setEnd] = useState('')
    const [error, setError] = useState(null)

    useEffect(() => {
        if (isOpen) {
            setTitle('')
            setDescription('')
            setStart('')
            setEnd('')
            setError(null)
        }
    }, [isOpen])

    const openModal = () => {
        console.log("kontrola: ", isControlled)
        console.log("internalIsOpen: ", internalIsOpen)
        if (!isControlled) {
            setInternalIsOpen(true)
        } else if (isControlled) {
            onClose(true) 
        }
    }

    const closeModal = () => {
        if (isControlled) {
            if (onClose) onClose()
        } else {
            setInternalIsOpen(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)

        const startISO = new Date(start).toISOString()
        const endISO = new Date(end).toISOString()

        if (new Date(endISO) <= new Date(startISO)) {
            setError('Data zakończenia musi być późniejsza niż data rozpoczęcia')
            return
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/google/calendar/add-event`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cookies.get('google_token')}`
                },
                body: JSON.stringify({
                    summary: title,
                    description: description,
                    start: startISO,
                    end: endISO
                })
            })

            if (!response.ok) {
                const err = await response.json()
                console.error('blad dodawania wydarzenia: ', err)
                setError('Błąd podczas dodawania wydarzenia')
                return
            }

            if (onEventAdded) onEventAdded()
            closeModal()
        } catch (e) {
            console.error("error during fetching calendar add event: ", e)
            setError('Błąd sieci podczas dodawania wydarzenia')
        }
    }

    return (
        <div>
            <button className="add-button" onClick={openModal}>
                Dodaj wydarzenie
            </button>

            {isOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="close-button" onClick={closeModal}>
                            &times;
                        </div>
                        <h2>Dodaj nowe wydarzenie</h2>
                        {error && <p style={{color: 'red'}}>{error}</p>}
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
                                Opis:
                                <input
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
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

export default AddEventModal
