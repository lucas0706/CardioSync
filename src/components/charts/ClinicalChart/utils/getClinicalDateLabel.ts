export function getClinicalDateLabel(
  value: string,
  range: 'day' | 'week' | 'month' | 'mapa' = 'day',
): string {

  const date = new Date(value)

  if (range === 'mapa') {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (range === 'day') {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (range === 'week') {
    return date.toLocaleDateString([], {
      weekday: 'short',
    })
  }

  return date.toLocaleDateString([], {
    day: '2-digit',
    month: '2-digit',
  })
}
