export function formatDateTime(
  value: string | Date | null | undefined,
): string {
  if (!value) {
    return '--'
  }

  const date =
    value instanceof Date ? value : new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '--'
  }

  const formatted = new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date)

  return formatted.replace(',', ' -')
}
