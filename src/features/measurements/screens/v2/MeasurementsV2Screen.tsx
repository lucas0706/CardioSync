import { memo, useCallback, useMemo, useRef, useState } from 'react'

import { FlatList, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native'

import { useFocusEffect, useRouter } from 'expo-router'

import { MaterialCommunityIcons } from '@expo/vector-icons'

import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Screen, ScreenHeader, Text } from '@/components/ui'

import { BloodPressureClassifier } from '@/domain/clinical/classification'

import type { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'

import type { MeasurementDateFilter } from '@/features/measurements/constants/dateFilters'

import { measurementHistoryFilterService } from '@/features/measurements/services/MeasurementHistoryFilterService'
import { measurementStore } from '@/features/measurements/services/MeasurementStore'

import { theme } from '@/theme'

const PERIOD_OPTIONS: Array<{
  key: MeasurementDateFilter
  label: string
}> = [
  { key: 'today', label: 'Hoy' },
  { key: 'week', label: 'Últimos 7 días' },
  { key: 'twoWeeks', label: 'Últimos 14 días' },
  { key: 'month', label: 'Últimos 30 días' },
  { key: 'ninetyDays', label: 'Últimos 90 días' },
  { key: 'oneHundredEightyDays', label: 'Últimos 180 días' },
  { key: 'threeHundredSixtyFiveDays', label: 'Últimos 365 días' },
  { key: 'calendarMonth', label: 'Mensual' },
  { key: 'previousYear', label: 'El año pasado' },
  { key: 'sixMonths', label: 'Últimos 6 meses' },
  { key: 'year', label: 'Último año' },
  { key: 'all', label: 'Todo el historial' },
  { key: 'custom', label: 'Personalizado' },
]

type HistoryListItem =
  | {
      type: 'date'
      key: string
      dateLabel: string
      weekdayLabel: string
      averageSystolic: number
      averageDiastolic: number
      color: string
      systolicDetermines: boolean
      diastolicDetermines: boolean
    }
  | {
      type: 'measurement'
      key: string
      record: BloodPressureRecord
    }

function formatDateInput(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8)

  if (digits.length <= 2) {
    return digits.length === 2 ? `${digits}/` : digits
  }

  if (digits.length <= 4) {
    return digits.length === 4
      ? `${digits.slice(0, 2)}/${digits.slice(2)}/`
      : `${digits.slice(0, 2)}/${digits.slice(2)}`
  }

  return `${digits.slice(0, 2)}/` + `${digits.slice(2, 4)}/` + digits.slice(4)
}

function formatDate(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '--/--/----'
  }

  return date.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function formatTime(value: string): string {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '--:--'
  }

  return date.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

function formatWeekday(date: Date): string {
  return date
    .toLocaleDateString('es-AR', {
      weekday: 'short',
    })
    .replace('.', '')
}

function getPeriodLabel(filter: MeasurementDateFilter): string {
  return PERIOD_OPTIONS.find((option) => option.key === filter)?.label ?? 'Período'
}

function getClassificationLabel(
  category: ReturnType<typeof BloodPressureClassifier.classify>['category'],
): string {
  switch (category) {
    case 'normal':
      return 'Normal'
    case 'borderline':
      return 'Limítrofe'
    case 'grade-1':
      return 'HTA nivel 1'
    case 'grade-2':
      return 'HTA nivel 2'
    case 'isolated-systolic':
      return 'Sistólica aislada'
  }
}

function getArmLabel(arm?: BloodPressureRecord['arm']): string | null {
  if (arm === 'left') return 'Brazo izquierdo'
  if (arm === 'right') return 'Brazo derecho'
  return null
}

function getPositionLabel(position?: BloodPressureRecord['position']): string | null {
  if (position === 'sitting') return 'Sentado'
  if (position === 'standing') return 'De pie'
  if (position === 'lying') return 'Acostado'
  return null
}

function getDateKey(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-')
}

function getLocalDayKey(): string {
  return getDateKey(new Date())
}

function buildHistoryRows(records: BloodPressureRecord[]): HistoryListItem[] {
  const recordsByDay = new Map<
    string,
    {
      date: Date
      records: BloodPressureRecord[]
    }
  >()

  for (const record of records) {
    const date = new Date(record.dateTime)
    if (Number.isNaN(date.getTime())) {
      continue
    }

    const day = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const key = getDateKey(day)
    const group = recordsByDay.get(key) ?? {
      date: day,
      records: [],
    }
    group.records.push(record)
    recordsByDay.set(key, group)
  }

  const rows: HistoryListItem[] = []

  for (const [key, group] of Array.from(recordsByDay.entries()).sort(([left], [right]) =>
    right.localeCompare(left),
  )) {
    const averageSystolic = Math.round(
      group.records.reduce((total, record) => total + record.systolic, 0) / group.records.length,
    )
    const averageDiastolic = Math.round(
      group.records.reduce((total, record) => total + record.diastolic, 0) / group.records.length,
    )
    const classification = BloodPressureClassifier.classify(averageSystolic, averageDiastolic)

    rows.push({
      type: 'date',
      key: `date-${key}`,
      dateLabel: group.date.toLocaleDateString('es-AR', {
        day: 'numeric',
        month: 'numeric',
      }),
      weekdayLabel: formatWeekday(group.date),
      averageSystolic,
      averageDiastolic,
      color: classification.color,
      systolicDetermines: classification.determiningPressures.systolic,
      diastolicDetermines: classification.determiningPressures.diastolic,
    })

    group.records.sort(
      (left, right) => new Date(right.dateTime).getTime() - new Date(left.dateTime).getTime(),
    )

    for (const record of group.records) {
      rows.push({
        type: 'measurement',
        key: record.id,
        record,
      })
    }
  }

  return rows
}

const MeasurementHistoryRow = memo(function MeasurementHistoryRow({
  record,
  showDetails,
}: {
  record: BloodPressureRecord
  showDetails: boolean
}) {
  const router = useRouter()
  const classification = BloodPressureClassifier.classify(record.systolic, record.diastolic)
  const detailParts = [getArmLabel(record.arm), getPositionLabel(record.position)].filter(
    (part): part is string => part !== null,
  )

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Medición ${record.systolic} sobre ${record.diastolic}, ${formatTime(record.dateTime)}`}
      onPress={() =>
        router.push({
          pathname: '/measurement/[id]',
          params: { id: record.id },
        })
      }
      style={({ pressed }) => [styles.recordRow, pressed && styles.recordPressed]}
    >
      <View style={styles.recordMainRow}>
        <View style={styles.recordMainLeft}>
          <Text numberOfLines={1} style={styles.pressureValue}>
            <Text
              style={
                classification.determiningPressures.systolic
                  ? { color: classification.color }
                  : undefined
              }
            >
              {record.systolic}
            </Text>
            /
            <Text
              style={
                classification.determiningPressures.diastolic
                  ? { color: classification.color }
                  : undefined
              }
            >
              {record.diastolic}
            </Text>
            <Text style={styles.pressureUnit}> mmHg</Text>
          </Text>
          <Text numberOfLines={1} style={styles.recordTime}>
            {formatTime(record.dateTime)}
          </Text>
        </View>
        {record.heartRate !== undefined && record.heartRate !== null ? (
          <Text numberOfLines={1} style={styles.heartRate}>
            {record.heartRate}
            <Text style={styles.heartRateUnit}> bpm</Text>
          </Text>
        ) : null}
      </View>

      <View style={styles.recordMetaRow}>
        <View style={styles.classificationWrap}>
          <View style={[styles.classificationDot, { backgroundColor: classification.color }]} />
          <Text
            numberOfLines={1}
            style={[styles.classificationLabel, { color: classification.color }]}
          >
            {getClassificationLabel(classification.category)}
          </Text>
        </View>
        {showDetails && detailParts.length > 0 ? (
          <Text numberOfLines={1} style={styles.detailText}>
            {detailParts.join(' · ')}
          </Text>
        ) : null}
      </View>
    </Pressable>
  )
})

function getObservedDateRange(records: BloodPressureRecord[]): {
  startDate: Date | null
  endDate: Date | null
} {
  let earliest: Date | null = null
  let latest: Date | null = null

  for (const record of records) {
    const date = new Date(record.dateTime)
    if (Number.isNaN(date.getTime())) {
      continue
    }

    if (!earliest || date < earliest) {
      earliest = date
    }
    if (!latest || date > latest) {
      latest = date
    }
  }

  return {
    startDate: earliest,
    endDate: latest,
  }
}

export function MeasurementsV2Screen() {
  const insets = useSafeAreaInsets()

  const [activeFilter, setActiveFilter] = useState<MeasurementDateFilter>('month')
  const [measurements, setMeasurements] = useState<BloodPressureRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [appliedRange, setAppliedRange] = useState<{
    startDate: Date | null
    endDate: Date | null
  }>({
    startDate: null,
    endDate: null,
  })
  const [appliedCustomStart, setAppliedCustomStart] = useState('')
  const [appliedCustomEnd, setAppliedCustomEnd] = useState('')
  const appliedPeriodRef = useRef<{
    filter: MeasurementDateFilter
    start: string
    end: string
  }>({
    filter: 'month',
    start: '',
    end: '',
  })
  const lastLoadedRef = useRef<{
    periodKey: string
    revision: number
    localDayKey: string
  } | null>(null)
  const loadRequestRef = useRef(0)
  const isFocusedRef = useRef(false)

  const [menuOpen, setMenuOpen] = useState(false)
  const [periodOpen, setPeriodOpen] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [draftFilter, setDraftFilter] = useState<MeasurementDateFilter>('month')
  const [customStart, setCustomStart] = useState('')
  const [customEnd, setCustomEnd] = useState('')
  const [customError, setCustomError] = useState('')
  const customEndInputRef = useRef<TextInput>(null)

  const loadMeasurements = useCallback(
    async (filter: MeasurementDateFilter, start = '', end = '') => {
      const requestId = ++loadRequestRef.current
      const requestedRevision = measurementStore.getRevision()

      lastLoadedRef.current = null
      setLoading(true)
      setLoadError('')
      setMeasurements([])
      setAppliedRange({
        startDate: null,
        endDate: null,
      })

      try {
        const result = await measurementHistoryFilterService.getRecordsAndRangeAsync(
          filter,
          start,
          end,
        )

        if (!isFocusedRef.current || requestId !== loadRequestRef.current) {
          return
        }

        if (requestedRevision !== measurementStore.getRevision()) {
          void loadMeasurements(filter, start, end)
          return
        }

        setMeasurements(result.records)
        setAppliedRange({
          startDate: result.startDate,
          endDate: result.endDate,
        })
        lastLoadedRef.current = {
          periodKey: `${filter}|${start}|${end}`,
          revision: requestedRevision,
          localDayKey: getLocalDayKey(),
        }
      } catch (error) {
        if (isFocusedRef.current && requestId === loadRequestRef.current) {
          console.error('[MeasurementFilter] Failed to load records', error)
          setLoadError('No se pudieron cargar las mediciones.')
        }
      } finally {
        if (isFocusedRef.current && requestId === loadRequestRef.current) {
          setLoading(false)
        }
      }
    },
    [],
  )

  useFocusEffect(
    useCallback(() => {
      isFocusedRef.current = true
      const period = appliedPeriodRef.current
      const periodKey = `${period.filter}|${period.start}|${period.end}`
      const previousLoad = lastLoadedRef.current
      if (
        previousLoad?.periodKey === periodKey &&
        previousLoad.revision === measurementStore.getRevision() &&
        previousLoad.localDayKey === getLocalDayKey()
      ) {
        return () => {
          isFocusedRef.current = false
          loadRequestRef.current += 1
        }
      }

      void loadMeasurements(period.filter, period.start, period.end)

      return () => {
        isFocusedRef.current = false
        loadRequestRef.current += 1
      }
    }, [loadMeasurements]),
  )

  const rows = useMemo(() => buildHistoryRows(measurements), [measurements])

  const summaryAverage = useMemo(() => {
    if (!measurements.length) {
      return { systolic: '—', diastolic: '—' }
    }

    const totals = measurements.reduce(
      (result, record) => ({
        systolic: result.systolic + record.systolic,
        diastolic: result.diastolic + record.diastolic,
      }),
      { systolic: 0, diastolic: 0 },
    )

    return {
      systolic: Math.round(totals.systolic / measurements.length),
      diastolic: Math.round(totals.diastolic / measurements.length),
    }
  }, [measurements])

  const dateRangeLabel = useMemo(() => {
    const range = activeFilter === 'all' ? getObservedDateRange(measurements) : appliedRange

    if (!range.startDate || !range.endDate) {
      return 'Sin mediciones'
    }

    return `${formatDate(range.startDate)} - ${formatDate(range.endDate)}`
  }, [activeFilter, appliedRange, measurements])

  const openPeriodSelector = () => {
    setMenuOpen(false)
    setDraftFilter(activeFilter)
    setCustomStart(appliedCustomStart)
    setCustomEnd(appliedCustomEnd)
    setCustomError('')
    setPeriodOpen(true)
  }

  const cancelPeriodSelector = () => {
    setCustomStart(appliedCustomStart)
    setCustomEnd(appliedCustomEnd)
    setCustomError('')
    setPeriodOpen(false)
  }

  const confirmPeriodSelection = () => {
    if (draftFilter === 'custom') {
      const datePattern = /^\d{2}\/\d{2}\/\d{4}$/

      if (!datePattern.test(customStart.trim()) || !datePattern.test(customEnd.trim())) {
        setCustomError('Usa el formato DD/MM/AAAA.')
        return
      }

      const [startDay, startMonth, startYear] = customStart.split('/').map(Number)
      const [endDay, endMonth, endYear] = customEnd.split('/').map(Number)
      const from = new Date(startYear, startMonth - 1, startDay)
      const to = new Date(endYear, endMonth - 1, endDay)

      if (
        from.getFullYear() !== startYear ||
        from.getMonth() !== startMonth - 1 ||
        from.getDate() !== startDay ||
        to.getFullYear() !== endYear ||
        to.getMonth() !== endMonth - 1 ||
        to.getDate() !== endDay
      ) {
        setCustomError('Ingresá fechas válidas.')
        return
      }

      if (from > to) {
        setCustomError('La fecha desde no puede ser posterior a la fecha hasta.')
        return
      }

      const endOfToday = new Date()
      endOfToday.setHours(23, 59, 59, 999)
      if (from > endOfToday || to > endOfToday) {
        setCustomError('No se pueden seleccionar fechas futuras.')
        return
      }

      setActiveFilter('custom')
      setAppliedCustomStart(customStart.trim())
      setAppliedCustomEnd(customEnd.trim())
      appliedPeriodRef.current = {
        filter: 'custom',
        start: customStart.trim(),
        end: customEnd.trim(),
      }
      void loadMeasurements('custom', customStart, customEnd)
      setPeriodOpen(false)
      setCustomError('')
      return
    }

    setActiveFilter(draftFilter)
    setAppliedCustomStart('')
    setAppliedCustomEnd('')
    appliedPeriodRef.current = {
      filter: draftFilter,
      start: '',
      end: '',
    }
    void loadMeasurements(draftFilter)
    setPeriodOpen(false)
    setCustomError('')
  }

  const renderHistoryItem = useCallback(
    ({ item }: { item: HistoryListItem }) => {
      if (item.type === 'date') {
        return (
          <View style={styles.groupHeader}>
            <View style={[styles.groupMarker, { backgroundColor: item.color }]} />
            <Text numberOfLines={1} style={styles.dayText}>
              {item.dateLabel} {item.weekdayLabel}
            </Text>
            <View style={styles.groupSummary}>
              <Text style={styles.groupAverage}>
                <Text style={item.systolicDetermines ? { color: item.color } : undefined}>
                  {item.averageSystolic}
                </Text>
                /
                <Text style={item.diastolicDetermines ? { color: item.color } : undefined}>
                  {item.averageDiastolic}
                </Text>
              </Text>
              <Text style={styles.groupUnit}>mmHg</Text>
            </View>
          </View>
        )
      }

      return <MeasurementHistoryRow record={item.record} showDetails={showDetails} />
    },
    [showDetails],
  )

  return (
    <Screen style={styles.screen}>
      <ScreenHeader
        title="Registro"
        trailingAlignedWithTitle
        trailing={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Abrir opciones"
            accessibilityState={{ expanded: menuOpen }}
            onPress={() => setMenuOpen((open) => !open)}
            style={styles.iconButton}
          >
            <MaterialCommunityIcons name="dots-vertical" size={24} color={theme.colors.text} />
          </Pressable>
        }
      />

      <View style={styles.container}>
        <FlatList
          data={rows}
          keyExtractor={(item) => item.key}
          renderItem={renderHistoryItem}
          ListHeaderComponent={
            <View style={styles.summarySection}>
              <View style={styles.summaryHeaderRow}>
                <Text numberOfLines={1} style={styles.rangeText}>
                  {dateRangeLabel} · {getPeriodLabel(activeFilter)}
                </Text>
                <Text style={styles.entriesText}>
                  {measurements.length} {measurements.length === 1 ? 'entrada' : 'entradas'}
                </Text>
              </View>
              <View style={styles.summaryHeaderRow}>
                <Text numberOfLines={1} style={styles.filterLabel}>
                  Filtro: Ninguno
                </Text>
                <Text style={styles.averageText}>
                  Promedio: {summaryAverage.systolic}/{summaryAverage.diastolic} mmHg
                </Text>
              </View>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              {loading ? (
                <Text style={styles.emptyTitle}>Cargando mediciones…</Text>
              ) : loadError ? (
                <Text style={styles.emptyText}>{loadError}</Text>
              ) : (
                <>
                  <Text style={styles.emptyTitle}>Sin mediciones</Text>
                  <Text style={styles.emptyText}>No hay registros en este período.</Text>
                </>
              )}
            </View>
          }
          contentContainerStyle={[styles.listContent, { paddingBottom: 110 + insets.bottom }]}
          showsVerticalScrollIndicator={false}
          initialNumToRender={12}
          maxToRenderPerBatch={12}
          windowSize={7}
        />

        {menuOpen ? (
          <View style={styles.overlay}>
            <Pressable
              accessibilityLabel="Cerrar menú"
              style={StyleSheet.absoluteFill}
              onPress={() => setMenuOpen(false)}
            />
            <View style={styles.menu}>
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  setShowDetails((value) => !value)
                  setMenuOpen(false)
                }}
                style={styles.menuOption}
              >
                <Text style={styles.menuOptionText}>
                  {showDetails ? 'Ocultar detalle' : 'Mostrar detalle'}
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={openPeriodSelector}
                style={styles.menuOption}
              >
                <Text style={styles.menuOptionText}>Seleccionar período</Text>
              </Pressable>
            </View>
          </View>
        ) : null}

        {periodOpen ? (
          <View style={styles.overlay}>
            <Pressable
              accessibilityLabel="Cerrar selector"
              style={StyleSheet.absoluteFill}
              onPress={cancelPeriodSelector}
            />
            <View style={styles.periodModal}>
              <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                <Text style={styles.modalTitle}>Seleccionar período</Text>
                <View style={styles.modalOptions}>
                  {PERIOD_OPTIONS.map((option) => {
                    const selected = draftFilter === option.key
                    return (
                      <Pressable
                        key={option.key}
                        accessibilityRole="button"
                        accessibilityState={{ selected }}
                        onPress={() => {
                          setDraftFilter(option.key)
                          setCustomError('')
                        }}
                        style={[styles.modalOption, selected && styles.modalOptionSelected]}
                      >
                        <Text
                          style={[
                            styles.modalOptionText,
                            selected && styles.modalOptionTextSelected,
                          ]}
                        >
                          {option.label}
                        </Text>
                      </Pressable>
                    )
                  })}
                </View>

                {draftFilter === 'custom' ? (
                  <View style={styles.dateInputsRow}>
                    <View style={styles.dateField}>
                      <Text style={styles.dateLabel}>Fecha inicial</Text>
                      <TextInput
                        value={customStart}
                        onChangeText={(value) => {
                          const formatted = formatDateInput(value)
                          setCustomStart(formatted)
                          if (formatted.length === 10) {
                            customEndInputRef.current?.focus()
                          }
                        }}
                        placeholder="DD/MM/AAAA"
                        placeholderTextColor={theme.colors.textSecondary}
                        keyboardType="number-pad"
                        maxLength={10}
                        style={styles.dateInput}
                      />
                    </View>
                    <View style={styles.dateField}>
                      <Text style={styles.dateLabel}>Fecha final</Text>
                      <TextInput
                        ref={customEndInputRef}
                        value={customEnd}
                        onChangeText={(value) => setCustomEnd(formatDateInput(value))}
                        placeholder="DD/MM/AAAA"
                        placeholderTextColor={theme.colors.textSecondary}
                        keyboardType="number-pad"
                        maxLength={10}
                        style={styles.dateInput}
                      />
                    </View>
                  </View>
                ) : null}

                {customError ? <Text style={styles.customError}>{customError}</Text> : null}

                <View style={styles.modalActions}>
                  <Pressable
                    accessibilityRole="button"
                    onPress={cancelPeriodSelector}
                    style={styles.modalAction}
                  >
                    <Text style={styles.modalActionText}>Cancelar</Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    onPress={confirmPeriodSelection}
                    style={styles.modalAction}
                  >
                    <Text style={styles.modalActionText}>Confirmar</Text>
                  </Pressable>
                </View>
              </ScrollView>
            </View>
          </View>
        ) : null}
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  iconButton: {
    width: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summarySection: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    gap: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  summaryHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  rangeText: {
    flex: 1,
    flexShrink: 1,
    color: theme.colors.text,
    fontFamily: theme.typography.medium,
    fontSize: theme.typography.caption,
  },
  entriesText: {
    flexShrink: 0,
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.regular,
    fontSize: theme.typography.caption,
  },
  filterLabel: {
    flex: 1,
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.regular,
    fontSize: theme.typography.caption,
  },
  averageText: {
    flexShrink: 0,
    color: theme.colors.text,
    fontFamily: theme.typography.medium,
    fontSize: theme.typography.caption,
  },
  listContent: {
    paddingTop: theme.spacing.xs,
  },
  groupHeader: {
    minHeight: 38,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  groupMarker: {
    width: 4,
    alignSelf: 'stretch',
    borderRadius: theme.radius.round,
    marginRight: theme.spacing.sm,
  },
  dayText: {
    flex: 1,
    minWidth: 0,
    color: theme.colors.text,
    fontFamily: theme.typography.semiBold,
    fontSize: theme.typography.body,
  },
  groupSummary: {
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  groupAverage: {
    color: theme.colors.text,
    fontFamily: theme.typography.semiBold,
    fontSize: theme.typography.body,
  },
  groupUnit: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.regular,
    fontSize: theme.typography.small,
  },
  recordRow: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  recordPressed: {
    opacity: 0.7,
  },
  recordMainRow: {
    minHeight: 27,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.xs,
  },
  recordMainLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'baseline',
    minWidth: 0,
    gap: theme.spacing.sm,
  },
  pressureValue: {
    flexShrink: 0,
    color: theme.colors.text,
    fontFamily: theme.typography.semiBold,
    fontSize: theme.typography.body,
  },
  pressureUnit: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.regular,
    fontSize: theme.typography.small,
  },
  recordTime: {
    flexShrink: 1,
    color: theme.colors.text,
    fontFamily: theme.typography.regular,
    fontSize: theme.typography.caption,
  },
  heartRate: {
    flexShrink: 0,
    color: theme.colors.text,
    fontFamily: theme.typography.medium,
    fontSize: theme.typography.body,
  },
  heartRateUnit: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.regular,
    fontSize: theme.typography.small,
  },
  recordMetaRow: {
    minHeight: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  classificationWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0,
    gap: 5,
  },
  classificationDot: {
    width: 7,
    height: 7,
    borderRadius: theme.radius.round,
  },
  classificationLabel: {
    flexShrink: 1,
    fontFamily: theme.typography.medium,
    fontSize: theme.typography.caption,
  },
  detailText: {
    flexShrink: 1,
    maxWidth: '55%',
    color: theme.colors.textSecondary,
    textAlign: 'right',
    fontFamily: theme.typography.regular,
    fontSize: theme.typography.small,
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
  },
  emptyTitle: {
    color: theme.colors.text,
    fontFamily: theme.typography.semiBold,
    fontSize: theme.typography.body,
  },
  emptyText: {
    marginTop: theme.spacing.xs,
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.regular,
    fontSize: theme.typography.caption,
    textAlign: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.24)',
  },
  menu: {
    position: 'absolute',
    top: 8,
    right: 8,
    minWidth: 200,
    paddingVertical: 4,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    elevation: 6,
  },
  menuOption: {
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  menuOptionText: {
    color: theme.colors.text,
    fontFamily: theme.typography.medium,
    fontSize: theme.typography.body,
  },
  periodModal: {
    width: '92%',
    maxHeight: '90%',
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  modalTitle: {
    marginBottom: theme.spacing.md,
    color: theme.colors.text,
    fontFamily: theme.typography.semiBold,
    fontSize: theme.typography.title,
  },
  modalOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  modalOption: {
    flexGrow: 1,
    flexBasis: '45%',
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  modalOptionSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary,
  },
  modalOptionText: {
    color: theme.colors.text,
    fontFamily: theme.typography.medium,
    fontSize: theme.typography.caption,
    textAlign: 'center',
  },
  modalOptionTextSelected: {
    color: theme.colors.white,
  },
  dateInputsRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  dateField: {
    flex: 1,
    minWidth: 0,
    gap: theme.spacing.xs,
  },
  dateLabel: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.medium,
    fontSize: theme.typography.caption,
  },
  dateInput: {
    minHeight: 44,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
    fontFamily: theme.typography.regular,
    fontSize: theme.typography.caption,
  },
  customError: {
    marginTop: theme.spacing.sm,
    color: theme.colors.danger,
    fontFamily: theme.typography.regular,
    fontSize: theme.typography.caption,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  modalAction: {
    minWidth: 96,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.background,
  },
  modalActionText: {
    color: theme.colors.primary,
    fontFamily: theme.typography.semiBold,
    fontSize: theme.typography.caption,
  },
})
