export type MeasurementDateFilter =
  | 'all'
  | 'week'
  | 'month'
  | 'sixMonths'
  | 'year'

export const MEASUREMENT_DATE_FILTERS: Array<{
  key: MeasurementDateFilter
  label: string
}> = [
  { key: 'all', label: 'Todo' },
  { key: 'week', label: 'Última semana' },
  { key: 'month', label: 'Último mes' },
  { key: 'sixMonths', label: 'Últimos 6 meses' },
  { key: 'year', label: 'Último año' },
]
