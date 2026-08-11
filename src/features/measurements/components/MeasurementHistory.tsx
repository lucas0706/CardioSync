import {
  useMemo,
  useState,
} from 'react'

import {
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native'

import { Text } from '@/components/ui'
import { MeasurementCard } from '@/features/measurements/components/MeasurementCard'
import {
  MEASUREMENT_DATE_FILTERS,
  MeasurementDateFilter,
} from '@/features/measurements/constants/dateFilters'
import { useMeasurements } from '@/features/measurements/hooks/useMeasurements'

export function MeasurementHistory() {
  const {
    loading,
    measurements,
  } = useMeasurements()

  const [activeFilter, setActiveFilter] =
    useState<MeasurementDateFilter>('all')

  const [customStart, setCustomStart] =
    useState('')

  const [customEnd, setCustomEnd] =
    useState('')

  const [customError, setCustomError] =
    useState('')

  const filteredMeasurements =
    useMemo(() => {
      const now = new Date()
      const startDate = new Date(now)

      if (activeFilter === 'week') {
        startDate.setDate(
          now.getDate() - 7,
        )
      } else if (
        activeFilter === 'month'
      ) {
        startDate.setMonth(
          now.getMonth() - 1,
        )
      } else if (
        activeFilter === 'sixMonths'
      ) {
        startDate.setMonth(
          now.getMonth() - 6,
        )
      } else if (
        activeFilter === 'year'
      ) {
        startDate.setFullYear(
          now.getFullYear() - 1,
        )
      } else if (
        activeFilter === 'custom'
      ) {
        if (
          !customStart ||
          !customEnd
        ) {
          return []
        }

        const from =
          new Date(customStart)

        const to =
          new Date(customEnd)

        if (
          Number.isNaN(
            from.getTime(),
          ) ||
          Number.isNaN(
            to.getTime(),
          )
        ) {
          return []
        }

        if (from > to) {
          return []
        }

        return measurements.filter(
          record => {
            const recordDate =
              new Date(
                record.dateTime,
              )

            return (
              !Number.isNaN(
                recordDate.getTime(),
              ) &&
              recordDate >= from &&
              recordDate <= to
            )
          },
        )
      } else {
        return measurements
      }

      return measurements.filter(
        record => {
          const recordDate =
            new Date(
              record.dateTime,
            )

          return (
            !Number.isNaN(
              recordDate.getTime(),
            ) &&
            recordDate >= startDate
          )
        },
      )
    }, [
      activeFilter,
      customEnd,
      customStart,
      measurements,
    ])

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

      const from =
        new Date(customStart)

      const to =
        new Date(customEnd)

      if (
        Number.isNaN(
          from.getTime(),
        ) ||
        Number.isNaN(
          to.getTime(),
        )
      ) {
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
                  setActiveFilter(
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

      {activeFilter ===
      'custom' ? (
        <View
          style={
            styles.customRangeCard
          }
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
              style={
                styles.inputGroup
              }
            >
              <Text
                style={
                  styles.inputLabel
                }
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
              style={
                styles.inputGroup
              }
            >
              <Text
                style={
                  styles.inputLabel
                }
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
              style={
                styles.errorText
              }
            >
              {customError}
            </Text>
          ) : null}

          <View
            style={
              styles.customActions
            }
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
        {filteredMeasurements.length}{' '}
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

  if (measurements.length === 0) {
    return (
      <Text>
        No hay mediciones registradas.
      </Text>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredMeasurements}
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
            No hay mediciones en este
            rango.
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
