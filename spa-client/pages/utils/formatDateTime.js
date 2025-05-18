const formatDateTime = (isoString) => {
  if (!isoString) return 'Brak'

  const date = new Date(isoString)
  return date.toLocaleString('pl-PL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export default formatDateTime