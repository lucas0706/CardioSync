import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import {
  useFocusEffect,
} from 'expo-router'

import {
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native'

import { Text } from '@/components/ui'
import type { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'
import { MeasurementCard } from '@/features/measurements/components/MeasurementCard'
import {
  MEASUREMENT_DATE_FILTERS,
  MeasurementDateFilter,
} from '@/features/measurements/constants/dateFilters'
import { measurementService } from '@/features/measurements/services/MeasurementService'

function parseCustomDate(
  value: string,
  endOfDay = false,
): Date | null {
  const match =
    /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(
      value.trim(),
    )

  if (!match) {
    return null
  }

  const day = Number(match[1])
  const month = Number(match[2])
  const year = Number(match[3])

  const date = new Date(
    year,
    month - 1,
    day,
  )

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null
  }

  if (endOfDay) {
    date.setHours(
      23,
      59,
      59,
      999,
    )
  } else {
    date.setHours(0, 0, 0, 0)
  }

  return date
}

function getStartDate(
  filter: Exclude<
    MeasurementDateFilter,
    'all' | 'custom'
  >,
): Date {
  const now = new Date()

  switch (filter) {
    case 'week':
      now.setDate(
        now.getDate() - 7,
      )
      break

    case 'month':
      now.setDate(
        now.getDate() - 30,
      )
      break

    case 'sixMonths':
      now.setMonth(
        now.getMonth() - 6,
      )
      break

    case 'year':
      now.setFullYear(
        now.getFullYear() - 1,
      )
      break
  }

  return now
}

function getRecordsForFilter(
  filter: MeasurementDateFilter,
  customStart: string,
  customEnd: string,
): BloodPressureRecord[] {
  if (filter === 'all') {
    return measurementService.getAll()
  }

  if (filter === 'custom') {
    const from = parseCustomDate(
      customStart,
    )

    const to = parseCustomDate(
      customEnd,
      true,
    )

    if (!from || !to || from > to) {
      return []
    }

    return measurementService.getByDateRange(
      from.toISOString(),
      to.toISOString(),
    )
  }

  const startDate = getStartDate(
    filter,
  )

  return measurementService.getByDateRange(
    startDate.toISOString(),
  )
}

export function MeasurementHistory() {
  const [activeFilter, setActiveFilter] =
    useState<MeasurementDateFilter>(
      'month',
    )

  const [customStart, setCustomStart] =
    useState('')

  const [customEnd, setCustomEnd] =
    useState('')

  const [customError, setCustomError] =
    useState('')

  const [measurements, setMeasurements] =
    useState<BloodPressureRecord[]>([])

  const [loading, setLoading] =
    useState(true)

  const [listVersion, setListVersion] =
    useState(0)

  const loadMeasurements =
    useCallback(() => {
      setLoading(true)

      try {
        const records =
          getRecordsForFilter(
            activeFilter,
            customStart,
            customEnd,
          )

        setMeasurements(records)
      } finally {
        setLoading(false)
      }
    }, [
      activeFilter,
      customEnd,
      customStart,
    ])

  useFocusEffect(
    useCallback(() => {
      setActiveFilter('month')
      setCustomStart('')
      setCustomEnd('')
      setCustomError('')
      setListVersion(
        current => current + 1,
      )

      setLoading(true)

      try {
        const records =
          getRecordsForFilter(
            'month',
            '',
            '',
          )

        setMeasurements(records)
      } finally {
        setLoading(false)
      }
    }, []),
  )


  useEffect(() => {
    if (activeFilter === 'month') {
      return
    }

    if (
      activeFilter === 'custom' &&
      (!customStart || !customEnd)
    ) {
      return
    }

    setLoading(true)

    try {
      const records =
        getRecordsForFilter(
          activeFilter,
          customStart,
          customEnd,
        )

      setMeasurements(records)
    } finally {
      setLoading(false)
    }
  }, [
    activeFilter,
    customEnd,
    customStart,
  ])

  const handleSelectFilter = (
    filter: MeasurementDateFilter,
  ) => {
    setCustomError('')

    if (filter === 'custom') {
      setActiveFilter('custom')
      return
    }

    setActiveFilter(filter)
  }

  const handleApplyCustomRange =
    () => {
      if (
        !customStart ||
        !customEnd
      ) {
        setCustomError(
          'Ambas fechas son requeridas.',
        )

        return
      }

      const from = parseCustomDate(
        customStart,
      )

      const to = parseCustomDate(
        customEnd,
        true,
      )

      if (!from || !to) {
        setCustomError(
          'Usa un rango válido en formato DD/MM/AAAA.',
        )

        return
      }

      if (from > to) {
        setCustomError(
          'La fecha desde no puede ser posterior a la fecha hasta.',
        )

        return
      }

      setCustomError('')
      setActiveFilter('custom')
    }

  const handleResetFilter =
    () => {
      setActiveFilter('all')
      setCustomStart('')
      setCustomEnd('')
      setCustomError('')
    }

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.filtersRow}>
        {MEASUREMENT_DATE_FILTERS.map(
          filter => {
            const isActive =
              activeFilter ===
              filter.key

            return (
              <Pressable
                key={filter.key}
                onPress={() =>
                  handleSelectFilter(
                    filter.key,
                  )
                }
                style={[
                  styles.filterChip,
                  isActive &&
                    styles.filterChipActive,
                ]}
              >
                <Text
                  style={
                    isActive
                      ? styles.filterTextActive
                      : styles.filterText
                  }
                >
                  {filter.label}
                </Text>
              </Pressable>
            )
          },
        )}
      </View>

      {activeFilter === 'custom' ? (
        <View
          style={styles.customRangeCard}
        >
          <Text
            style={styles.customTitle}
          >
            Rango personalizado
          </Text>

          <View
            style={styles.inputRow}
          >
            <View
              style={styles.inputGroup}
            >
              <Text
                style={styles.inputLabel}
              >
                Desde
              </Text>

              <TextInput
                style={styles.input}
                value={customStart}
                onChangeText={
                  setCustomStart
                }
                placeholder="DD/MM/AAAA"
                keyboardType="numbers-and-punctuation"
              />
            </View>

            <View
              style={styles.inputGroup}
            >
              <Text
                style={styles.inputLabel}
              >
                Hasta
              </Text>

              <TextInput
                style={styles.input}
                value={customEnd}
                onChangeText={
                  setCustomEnd
                }
                placeholder="DD/MM/AAAA"
                keyboardType="numbers-and-punctuation"
              />
            </View>
          </View>

          {customError ? (
            <Text
              style={styles.errorText}
            >
              {customError}
            </Text>
          ) : null}

          <View
            style={styles.customActions}
          >
            <Pressable
              onPress={
                handleApplyCustomRange
              }
              style={
                styles.applyButton
              }
            >
              <Text
                style={
                  styles.applyButtonText
                }
              >
                Aplicar
              </Text>
            </Pressable>

            <Pressable
              onPress={
                handleResetFilter
              }
              style={
                styles.resetButton
              }
            >
              <Text
                style={
                  styles.resetButtonText
                }
              >
                Todo
              </Text>
            </Pressable>
          </View>
        </View>
      ) : null}

      <Text
        style={styles.resultCount}
      >
        {measurements.length}{' '}
        mediciones
      </Text>
    </View>
  )

  if (loading) {
    return (
      <Text>
        Cargando...
      </Text>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        key={`measurement-history-${listVersion}`}
        data={measurements}
        keyExtractor={item =>
          item.id
        }
        renderItem={({ item }) => (
          <MeasurementCard
            record={item}
          />
        )}
        ListHeaderComponent={
          renderHeader
        }
        ListEmptyComponent={
          <Text
            style={
              styles.emptyState
            }
          >
            {activeFilter === 'month'
              ? 'No hay mediciones en los últimos 30 días.'
              : 'No hay mediciones en este rango.'}
          </Text>
        }
        contentContainerStyle={
          styles.listContent
        }
        initialNumToRender={12}
        maxToRenderPerBatch={8}
        windowSize={7}
        removeClippedSubviews
        showsVerticalScrollIndicator
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },

  header: {
    gap: 12,
    paddingBottom: 12,
  },

  listContent: {
    gap: 12,
    paddingBottom: 100,
  },

  filtersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  filterChip: {
    borderColor: '#CBD5E1',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  filterChipActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },

  filterText: {
    color: '#334155',
    fontSize: 12,
    fontWeight: '600',
  },

  filterTextActive: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  customRangeCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    gap: 10,
    padding: 12,
  },

  customTitle: {
    fontSize: 14,
    fontWeight: '700',
  },

  inputRow: {
    flexDirection: 'row',
    gap: 10,
  },

  inputGroup: {
    flex: 1,
    gap: 4,
  },

  inputLabel: {
    color: '#64748B',
    fontSize: 12,
  },

  input: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CBD5E1',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  customActions: {
    flexDirection: 'row',
    gap: 10,
  },

  applyButton: {
    backgroundColor: '#2563EB',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },

  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  resetButton: {
    borderColor: '#CBD5E1',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },

  resetButtonText: {
    color: '#334155',
    fontSize: 12,
    fontWeight: '700',
  },

  errorText: {
    color: '#DC2626',
    fontSize: 12,
  },

  resultCount: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '600',
  },

  emptyState: {
    color: '#64748B',
    paddingVertical: 20,
  },
})
