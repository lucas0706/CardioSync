import { useEffect, useMemo, useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'

import { Text } from '@/components/ui'
import { MeasurementCard } from '@/features/measurements/components/MeasurementCard'
import {
  MEASUREMENT_DATE_FILTERS,
  MeasurementDateFilter,
} from '@/features/measurements/constants/dateFilters'
import { useMeasurements } from '@/features/measurements/hooks/useMeasurements'

type Props = {
  refreshKey?: number
}

export function MeasurementHistory({ refreshKey }: Props) {
  const {
    loading,
    measurements,
    refresh,
  } = useMeasurements()
  const [activeFilter, setActiveFilter] =
    useState<MeasurementDateFilter>('all')

  useEffect(() => {
    refresh()
  }, [refresh, refreshKey])

  const filteredMeasurements = useMemo(() => {
    const now = new Date()
    const startDate = new Date(now)

    if (activeFilter === 'week') {
      startDate.setDate(now.getDate() - 7)
    } else if (activeFilter === 'month') {
      startDate.setMonth(now.getMonth() - 1)
    } else if (activeFilter === 'sixMonths') {
      startDate.setMonth(now.getMonth() - 6)
    } else if (activeFilter === 'year') {
      startDate.setFullYear(now.getFullYear() - 1)
    } else {
      return measurements
    }

    return measurements.filter((record) => {
      const recordDate = new Date(record.dateTime)
      return !Number.isNaN(recordDate.getTime()) && recordDate >= startDate
    })
  }, [activeFilter, measurements])

  if (loading) {
    return <Text>Cargando...</Text>
  }

  if (measurements.length === 0) {
    return <Text>No hay mediciones registradas.</Text>
  }

  return (
    <View style={styles.container}>
      <View style={styles.filtersRow}>
        {MEASUREMENT_DATE_FILTERS.map((filter) => {
          const isActive = activeFilter === filter.key

          return (
            <Pressable
              key={filter.key}
              onPress={() => setActiveFilter(filter.key)}
              style={[styles.filterChip, isActive && styles.filterChipActive]}
            >
              <Text style={isActive ? styles.filterTextActive : styles.filterText}>
                {filter.label}
              </Text>
            </Pressable>
          )
        })}
      </View>

      {filteredMeasurements.length === 0 ? (
        <Text style={styles.emptyState}>No hay mediciones en este rango.</Text>
      ) : (
        filteredMeasurements.map((record) => (
          <MeasurementCard
            key={record.id}
            record={record}
          />
        ))
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    marginTop: 20,
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

  emptyState: {
    color: '#64748B',
    marginTop: 8,
  },
})
