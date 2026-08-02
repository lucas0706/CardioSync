export function getClinicalTooltipDate(
  value: string,
): string {

  if (!value) {
    return ''
  }

  return new Date(value)
    .toLocaleString(
      [],
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      },
    )
}
