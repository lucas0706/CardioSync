import { StyleSheet, View, ScrollView } from 'react-native'

import { AppButton } from '@/components/form'
import { Text } from '@/components/ui'
import { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'
import { ClassificationBadge } from '@/features/measurements/components/ClassificationBadge'
import { classifyBloodPressure } from '@/features/measurements/utils/classifyBloodPressure'

type Props = {
  record: BloodPressureRecord
}

export function MeasurementDetail({ record }: Props) {
  const classification = classifyBloodPressure(
    record.systolic,
    record.diastolic,
  )

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerCard}>
        <ClassificationBadge classification={classification} />

        <Text style={styles.title}>Detalle de medición</Text>
        <Text style={styles.date}>
          {new Date(record.dateTime).toLocaleString()}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Información principal</Text>

        <View style={styles.metricRow}>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>Sistólica</Text>
            <Text style={styles.metricValue}>{record.systolic}</Text>
          </View>

          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>Diastólica</Text>
            <Text style={styles.metricValue}>{record.diastolic}</Text>
          </View>
        </View>

        <View style={styles.metricRow}>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>Frecuencia cardíaca</Text>
            <Text style={styles.metricValue}>
              {record.heartRate != null ? `${record.heartRate} lpm` : '—'}
            </Text>
          </View>
        </View>
      </View>

      {(record.notes || record.arm || record.position) && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Información adicional</Text>

          {record.notes ? (
            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>Notas</Text>
              <Text style={styles.fieldValue}>{record.notes}</Text>
            </View>
          ) : null}

          {record.arm ? (
            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>Brazo</Text>
              <Text style={styles.fieldValue}>
                {record.arm === 'left' ? 'Izquierdo' : 'Derecho'}
              </Text>
            </View>
          ) : null}

          {record.position ? (
            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>Posición</Text>
              <Text style={styles.fieldValue}>
                {record.position === 'sitting'
                  ? 'Sentado'
                  : record.position === 'standing'
                    ? 'De pie'
                    : 'Acostado'}
              </Text>
            </View>
          ) : null}
        </View>
      )}

      <View style={styles.actions}>
        <AppButton title="Editar" onPress={() => undefined} />
        <AppButton title="Eliminar" onPress={() => undefined} />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
    paddingBottom: 24,
  },

  headerCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 20,
    gap: 8,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
  },

  date: {
    color: '#64748B',
    fontSize: 14,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    gap: 12,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },

  metricRow: {
    flexDirection: 'row',
    gap: 12,
  },

  metricBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    gap: 6,
  },

  metricLabel: {
    color: '#64748B',
    fontSize: 12,
    textTransform: 'uppercase',
  },

  metricValue: {
    fontSize: 24,
    fontWeight: '700',
  },

  fieldBlock: {
    gap: 4,
  },

  fieldLabel: {
    color: '#64748B',
    fontSize: 12,
    textTransform: 'uppercase',
  },

  fieldValue: {
    fontSize: 16,
    fontWeight: '500',
  },

  actions: {
    gap: 10,
  },
})
