import {
  useCallback,
  useRef,
  useState,
} from 'react'

import {
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native'

import {
  useFocusEffect,
} from 'expo-router'

import { useSafeAreaInsets } from 'react-native-safe-area-context'

import {
  Screen,
  Text,
} from '@/components/ui'

import {
  BottomTabBar,
} from '@/components/ui/v2'

import { theme } from '@/theme'

import {
  MEASUREMENT_DATE_FILTERS,
  type MeasurementDateFilter,
} from '@/features/measurements/constants/dateFilters'

import {
  measurementHistoryFilterService,
} from '@/features/measurements/services/MeasurementHistoryFilterService'

import type { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'

import {
  MeasurementRowV2,
} from '@/features/measurements/components/v2/MeasurementRowV2'

function formatDateInput(
  value: string,
): string {
  const digits = value
    .replace(/\D/g, '')
    .slice(0, 8)

  if (digits.length <= 2) {
    return digits.length === 2
      ? `${digits}/`
      : digits
  }

  if (digits.length <= 4) {
    return digits.length === 4
      ? `${digits.slice(0, 2)}/${digits.slice(2)}/`
      : `${digits.slice(0, 2)}/${digits.slice(2)}`
  }

  return (
    `${digits.slice(0, 2)}/` +
    `${digits.slice(2, 4)}/` +
    digits.slice(4)
  )
}

export function MeasurementsV2Screen() {
  const insets = useSafeAreaInsets()

  const [
    activeFilter,
    setActiveFilter,
  ] = useState<MeasurementDateFilter>('month')

  const [
    measurements,
    setMeasurements,
  ] = useState<BloodPressureRecord[]>([])

  const [
    customOpen,
    setCustomOpen,
  ] = useState(false)

  const [
    customStart,
    setCustomStart,
  ] = useState('')

  const [
    customEnd,
    setCustomEnd,
  ] = useState('')

  const customEndInputRef =
    useRef<TextInput>(null)

  const [
    customError,
    setCustomError,
  ] = useState('')

  const loadMeasurements =
    useCallback(
      (
        filter: MeasurementDateFilter,
        start = '',
        end = '',
      ) => {
        setMeasurements(
          measurementHistoryFilterService.getRecords(
            filter,
            start,
            end,
          ),
        )
      },
      [],
    )

  useFocusEffect(
    useCallback(() => {
      setActiveFilter('month')
      loadMeasurements('month')
    }, [loadMeasurements]),
  )

  const handleFilterPress =
    (
      filter: MeasurementDateFilter,
    ) => {
      setCustomError('')

      if (filter === 'custom') {
        setCustomOpen(true)
        return
      }

      setCustomOpen(false)
      setActiveFilter(filter)
      loadMeasurements(filter)
    }

  const handleClearCustom = () => {
    setCustomStart('')
    setCustomEnd('')
    setCustomError('')
    setCustomOpen(false)
    setActiveFilter('month')
    loadMeasurements('month')
  }

  const handleApplyCustom =
    () => {
      const datePattern =
        /^\d{2}\/\d{2}\/\d{4}$/

      if (
        !datePattern.test(
          customStart.trim(),
        ) ||
        !datePattern.test(
          customEnd.trim(),
        )
      ) {
        setCustomError(
          'Usa el formato DD/MM/AAAA.',
        )

        return
      }

      const [startDay, startMonth, startYear] =
        customStart.split('/').map(Number)

      const [endDay, endMonth, endYear] =
        customEnd.split('/').map(Number)

      const from = new Date(
        startYear,
        startMonth - 1,
        startDay,
      )

      const to = new Date(
        endYear,
        endMonth - 1,
        endDay,
      )

      if (
        from.getFullYear() !== startYear ||
        from.getMonth() !== startMonth - 1 ||
        from.getDate() !== startDay ||
        to.getFullYear() !== endYear ||
        to.getMonth() !== endMonth - 1 ||
        to.getDate() !== endDay
      ) {
        setCustomError(
          'Ingresá fechas válidas.',
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

      loadMeasurements(
        'custom',
        customStart,
        customEnd,
      )
    }

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            Registros
          </Text>

          <Text style={styles.subtitle}>
            Tus mediciones de presión arterial
          </Text>
        </View>

        <FlatList
          data={measurements}
          keyExtractor={item => item.id}
          renderItem={({ item, index }) => (
            <MeasurementRowV2
              record={item}
              alternate={index % 2 === 1}
            />
          )}
          ListHeaderComponent={
            <View style={styles.listHeader}>
              <View style={styles.filterRows}>
                <View style={styles.filterRow}>
                  {(
                    [
                      'week',
                      'month',
                      'sixMonths',
                      'year',
                    ] as MeasurementDateFilter[]
                  ).map(filterKey => {
                    const filter =
                      MEASUREMENT_DATE_FILTERS.find(
                        item =>
                          item.key === filterKey,
                      )

                    if (!filter) {
                      return null
                    }

                    return (
                      <Pressable
                        key={filter.key}
                        onPress={() =>
                          handleFilterPress(
                            filter.key,
                          )
                        }
                        style={[
                          styles.filter,
                          activeFilter ===
                            filter.key &&
                            styles.filterActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.filterText,
                            activeFilter ===
                              filter.key &&
                              styles.filterTextActive,
                          ]}
                        >
                          {filter.key === 'week'
                            ? '7 días'
                            : filter.key === 'month'
                              ? '30 días'
                              : filter.key === 'sixMonths'
                                ? '6 meses'
                                : '1 año'}
                        </Text>
                      </Pressable>
                    )
                  })}
                </View>

                <View style={styles.filterRow}>
                  {(
                    [
                      'all',
                      'custom',
                    ] as MeasurementDateFilter[]
                  ).map(filterKey => {
                    const filter =
                      MEASUREMENT_DATE_FILTERS.find(
                        item =>
                          item.key === filterKey,
                      )

                    if (!filter) {
                      return null
                    }

                    return (
                      <Pressable
                        key={filter.key}
                        onPress={() =>
                          handleFilterPress(
                            filter.key,
                          )
                        }
                        style={[
                          styles.filter,
                          activeFilter ===
                            filter.key &&
                            styles.filterActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.filterText,
                            activeFilter ===
                              filter.key &&
                              styles.filterTextActive,
                          ]}
                        >
                          {filter.key === 'all'
                            ? 'Todo'
                            : 'Personalizado'}
                        </Text>
                      </Pressable>
                    )
                  })}
                </View>
              </View>

              {customOpen ? (
                <View style={styles.customCard}>
                  <View style={styles.customFields}>
                    <View style={styles.customField}>
                      <Text style={styles.customLabel}>
                        Desde
                      </Text>

                      <TextInput
                        value={customStart}
                        onChangeText={value => {
                          const formatted =
                            formatDateInput(value)

                          setCustomStart(
                            formatted,
                          )

                          if (
                            formatted.length === 10
                          ) {
                            customEndInputRef.current?.focus()
                          }
                        }}
                        placeholder="DD/MM/AAAA"
                        placeholderTextColor={
                          theme.colors.textSecondary
                        }
                        keyboardType="number-pad"
                        maxLength={10}
                        style={styles.customInput}
                      />
                    </View>

                    <View style={styles.customField}>
                      <Text style={styles.customLabel}>
                        Hasta
                      </Text>

                      <TextInput
                        ref={customEndInputRef}
                        value={customEnd}
                        onChangeText={value =>
                          setCustomEnd(
                            formatDateInput(value),
                          )
                        }
                        placeholder="DD/MM/AAAA"
                        placeholderTextColor={
                          theme.colors.textSecondary
                        }
                        keyboardType="number-pad"
                        maxLength={10}
                        style={styles.customInput}
                      />
                    </View>
                  </View>

                  {customError ? (
                    <Text style={styles.customError}>
                      {customError}
                    </Text>
                  ) : null}

                  <View style={styles.customActions}>
                    <Pressable
                      onPress={handleClearCustom}
                      style={styles.clearButton}
                    >
                      <Text style={styles.clearButtonText}>
                        Limpiar
                      </Text>
                    </Pressable>

                    <Pressable
                      onPress={handleApplyCustom}
                      style={styles.customButton}
                    >
                      <Text style={styles.customButtonText}>
                        Aplicar
                      </Text>
                    </Pressable>
                  </View>
                </View>
              ) : null}

              <Text style={styles.count}>
                {measurements.length}{' '}
                {measurements.length === 1
                  ? 'medición'
                  : 'mediciones'}
              </Text>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>
                No hay mediciones
              </Text>

              <Text style={styles.emptyText}>
                No encontramos mediciones
                en este período.
              </Text>
            </View>
          }
          contentContainerStyle={[
            styles.listContent,
            {
              paddingBottom:
                108 + insets.bottom,
            },
          ]}
          ItemSeparatorComponent={() => (
            <View style={styles.separator} />
          )}
          showsVerticalScrollIndicator={false}
        />

        <BottomTabBar
          activeTab="measurements"
          onTabPress={() => {}}
        />
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    gap: theme.spacing.xs,
  },

  title: {
    fontFamily: theme.typography.bold,
    fontSize: 28,
    lineHeight: 34,
    color: theme.colors.text,
  },

  subtitle: {
    fontFamily: theme.typography.regular,
    fontSize: theme.typography.body,
    color: theme.colors.textSecondary,
  },

  listHeader: {
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
  },

  filterRows: {
    gap: theme.spacing.xs,
  },

  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },

  filter: {
    minHeight: 36,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.radius.round,
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  filterActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },

  filterText: {
    fontFamily: theme.typography.medium,
    fontSize: theme.typography.caption,
    color: theme.colors.textSecondary,
  },

  filterTextActive: {
    color: theme.colors.white,
  },

  customCard: {
    padding: theme.spacing.sm,
    borderRadius: theme.radius.md,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.sm,
  },

  customFields: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },

  customField: {
    flex: 1,
    gap: theme.spacing.xs,
  },

  customLabel: {
    fontFamily: theme.typography.medium,
    fontSize: theme.typography.caption,
    color: theme.colors.textSecondary,
  },

  customInput: {
    minHeight: 40,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    fontFamily: theme.typography.regular,
    fontSize: theme.typography.caption,
    color: theme.colors.text,
  },

  customError: {
    fontFamily: theme.typography.regular,
    fontSize: theme.typography.caption,
    color: '#DC2626',
  },

  customActions: {
    flexDirection: 'row',
    width: '100%',
    gap: theme.spacing.sm,
  },

  clearButton: {
    width: '50%',
    flexGrow: 0,
    flexShrink: 0,
    minHeight: 38,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  clearButtonText: {
    fontFamily: theme.typography.semiBold,
    fontSize: theme.typography.caption,
    color: theme.colors.textSecondary,
  },

  customButton: {
    width: '50%',
    flexGrow: 0,
    flexShrink: 0,
    minHeight: 38,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
  },

  customButtonText: {
    fontFamily: theme.typography.semiBold,
    fontSize: theme.typography.caption,
    color: theme.colors.white,
  },

  count: {
    fontFamily: theme.typography.semiBold,
    fontSize: theme.typography.caption,
    color: theme.colors.textSecondary,
  },

  listContent: {
    paddingTop: theme.spacing.xs,
    paddingHorizontal: 0,
  },

  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.border,
  },

  empty: {
    alignItems: 'center',
    paddingTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },

  emptyTitle: {
    fontFamily: theme.typography.semiBold,
    fontSize: theme.typography.body,
    color: theme.colors.text,
  },

  emptyText: {
    marginTop: theme.spacing.xs,
    fontFamily: theme.typography.regular,
    fontSize: theme.typography.caption,
    textAlign: 'center',
    color: theme.colors.textSecondary,
  },
})
