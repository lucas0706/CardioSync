import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'

import { AppButton } from '@/components/form'

import { Text } from '@/components/ui'

import type {
  BloodPressureRecord,
} from '@/domain/measurements/BloodPressureRecord'

import {
  BloodPressureClassifier,
} from '@/domain/clinical/classification'

import {
  BloodPressureSafetyWarning,
} from '@/features/measurements/components/BloodPressureSafetyWarning'

import {
  ClassificationBadge,
} from '@/features/measurements/components/ClassificationBadge'

import {
  formatDateTime,
} from '@/utils/date'

import { theme } from '@/theme'

type Props = {
  record: BloodPressureRecord
  onEdit?: () => void
  onDelete?: () => void
}

function formatDate(
  value: string,
): string {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '—'
  }

  return `${String(
    date.getDate(),
  ).padStart(2, '0')}/${String(
    date.getMonth() + 1,
  ).padStart(2, '0')}/${date.getFullYear()}`
}

function formatTime(
  value: string,
): string {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '—'
  }

  return `${String(
    date.getHours(),
  ).padStart(2, '0')}:${String(
    date.getMinutes(),
  ).padStart(2, '0')}`
}

function getArmLabel(
  arm?: BloodPressureRecord['arm'],
): string {
  if (arm === 'left') {
    return 'Izquierdo'
  }

  if (arm === 'right') {
    return 'Derecho'
  }

  return '—'
}

function getPositionLabel(
  position?: BloodPressureRecord['position'],
): string {
  if (position === 'sitting') {
    return 'Sentado'
  }

  if (position === 'standing') {
    return 'De pie'
  }

  if (position === 'lying') {
    return 'Acostado'
  }

  return '—'
}

export function MeasurementDetail({
  record,
  onEdit,
  onDelete,
}: Props) {
  const classification =
    BloodPressureClassifier.classify(
      record.systolic,
      record.diastolic,
    )

  const warnings =
    classification.safetyWarnings

  return (
    <ScrollView
      contentContainerStyle={
        styles.content
      }
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>
          Detalle de medición
        </Text>

        <Text style={styles.subtitle}>
          Presión arterial registrada
        </Text>
      </View>

      <View style={styles.metricsSection}>
        <View style={styles.pressureRow}>
          <View
            style={styles.metricCard}
          >
            <Text
              style={styles.metricLabel}
            >
              SIS
            </Text>

            <Text
              style={styles.metricValue}
            >
              {record.systolic}
            </Text>

            <Text
              style={styles.metricUnit}
            >
              mmHg
            </Text>
          </View>

          <View
            style={styles.metricCard}
          >
            <Text
              style={styles.metricLabel}
            >
              DIA
            </Text>

            <Text
              style={styles.metricValue}
            >
              {record.diastolic}
            </Text>

            <Text
              style={styles.metricUnit}
            >
              mmHg
            </Text>
          </View>
        </View>

        <View
          style={styles.fcCard}
        >
          <Text
            style={styles.metricLabel}
          >
            FC
          </Text>

          <Text
            style={styles.metricValue}
          >
            {record.heartRate != null
              ? record.heartRate
              : '—'}
          </Text>

          <Text
            style={styles.metricUnit}
          >
            bpm
          </Text>
        </View>
      </View>

      <View style={styles.analysisSection}>
        <View
          style={styles.analysisBlock}
        >
          <Text
            style={styles.overline}
          >
            CLASIFICACIÓN
          </Text>

          <ClassificationBadge
            classification={
              classification
            }
          />
        </View>

        {warnings.length > 0 ? (
          <View
            style={styles.analysisBlock}
          >
            <Text
              style={styles.overline}
            >
              ALERTA
            </Text>

            <BloodPressureSafetyWarning
              warnings={warnings}
            />
          </View>
        ) : null}
      </View>

      <View style={styles.section}>
        <Text style={styles.overline}>
          FECHA Y HORA
        </Text>

        <View
          style={styles.infoRow}
        >
          <View
            style={styles.infoItem}
          >
            <Text
              style={styles.infoLabel}
            >
              Fecha
            </Text>

            <Text
              style={styles.infoValue}
            >
              {formatDate(
                record.dateTime,
              )}
            </Text>
          </View>

          <View
            style={styles.infoItem}
          >
            <Text
              style={styles.infoLabel}
            >
              Hora
            </Text>

            <Text
              style={styles.infoValue}
            >
              {formatTime(
                record.dateTime,
              )}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.overline}>
          CONTEXTO
        </Text>

        <View
          style={styles.infoRow}
        >
          <View
            style={styles.infoItem}
          >
            <Text
              style={styles.infoLabel}
            >
              Brazo
            </Text>

            <Text
              style={styles.infoValue}
            >
              {getArmLabel(
                record.arm,
              )}
            </Text>
          </View>

          <View
            style={styles.infoItem}
          >
            <Text
              style={styles.infoLabel}
            >
              Posición
            </Text>

            <Text
              style={styles.infoValue}
            >
              {getPositionLabel(
                record.position,
              )}
            </Text>
          </View>
        </View>
      </View>

      {record.notes ? (
        <View style={styles.section}>
          <Text style={styles.overline}>
            NOTAS
          </Text>

          <View
            style={styles.notesCard}
          >
            <Text
              style={styles.notesText}
            >
              {record.notes}
            </Text>
          </View>
        </View>
      ) : null}

      <View style={styles.actions}>
        <AppButton
          title="Editar"
          onPress={
            onEdit ??
            (() => undefined)
          }
        />

        <AppButton
          title="Eliminar"
          onPress={
            onDelete ??
            (() => undefined)
          }
        />
      </View>

      <Text style={styles.timestamp}>
        Registrada{' '}
        {formatDateTime(
          record.createdAt,
        )}
      </Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal:
      theme.spacing.md,
    paddingBottom:
      theme.spacing.lg,
    gap: theme.spacing.md,
  },

  header: {
    gap: theme.spacing.xs,
  },

  title: {
    fontFamily:
      theme.typography.bold,
    fontSize: 28,
    lineHeight: 34,
    color: theme.colors.text,
  },

  subtitle: {
    fontFamily:
      theme.typography.regular,
    fontSize:
      theme.typography.body,
    color:
      theme.colors.textSecondary,
  },

  metricsSection: {
    gap: theme.spacing.sm,
  },

  pressureRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },

  metricCard: {
    flex: 1,
    minHeight: 108,
    paddingHorizontal:
      theme.spacing.md,
    paddingVertical:
      theme.spacing.md,
    borderRadius:
      theme.radius.lg,
    backgroundColor:
      theme.colors.surface,
    borderWidth:
      StyleSheet.hairlineWidth,
    borderColor:
      theme.colors.border,
  },

  fcCard: {
    minHeight: 108,
    paddingHorizontal:
      theme.spacing.md,
    paddingVertical:
      theme.spacing.md,
    borderRadius:
      theme.radius.lg,
    backgroundColor:
      theme.colors.surface,
    borderWidth:
      StyleSheet.hairlineWidth,
    borderColor:
      theme.colors.border,
    alignItems: 'center',
  },

  metricLabel: {
    fontFamily:
      theme.typography.semiBold,
    fontSize:
      theme.typography.label,
    color:
      theme.colors.textSecondary,
  },

  metricValue: {
    marginTop:
      theme.spacing.sm,
    fontFamily:
      theme.typography.bold,
    fontSize:
      theme.typography.metric,
    lineHeight: 42,
    color:
      theme.colors.text,
  },

  metricUnit: {
    marginTop:
      theme.spacing.xs,
    fontFamily:
      theme.typography.regular,
    fontSize:
      theme.typography.small,
    color:
      theme.colors.textSecondary,
  },

  analysisSection: {
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    borderRadius:
      theme.radius.lg,
    backgroundColor:
      theme.colors.surface,
    borderWidth:
      StyleSheet.hairlineWidth,
    borderColor:
      theme.colors.border,
  },

  analysisBlock: {
    gap: theme.spacing.xs,
  },

  overline: {
    fontFamily:
      theme.typography.semiBold,
    fontSize:
      theme.typography.overline,
    color:
      theme.colors.textSecondary,
    letterSpacing: 0.5,
  },

  section: {
    gap: theme.spacing.sm,
  },

  infoRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },

  infoItem: {
    flex: 1,
    minHeight: 64,
    paddingHorizontal:
      theme.spacing.md,
    paddingVertical:
      theme.spacing.sm,
    borderRadius:
      theme.radius.md,
    backgroundColor:
      theme.colors.surface,
    borderWidth:
      StyleSheet.hairlineWidth,
    borderColor:
      theme.colors.border,
    justifyContent:
      'center',
  },

  infoLabel: {
    fontFamily:
      theme.typography.medium,
    fontSize:
      theme.typography.small,
    color:
      theme.colors.textSecondary,
  },

  infoValue: {
    marginTop:
      theme.spacing.xs,
    fontFamily:
      theme.typography.semiBold,
    fontSize:
      theme.typography.body,
    color:
      theme.colors.text,
  },

  notesCard: {
    paddingHorizontal:
      theme.spacing.md,
    paddingVertical:
      theme.spacing.md,
    borderRadius:
      theme.radius.md,
    backgroundColor:
      theme.colors.surface,
    borderWidth:
      StyleSheet.hairlineWidth,
    borderColor:
      theme.colors.border,
  },

  notesText: {
    fontFamily:
      theme.typography.regular,
    fontSize:
      theme.typography.body,
    lineHeight: 22,
    color:
      theme.colors.text,
  },

  actions: {
    gap: theme.spacing.sm,
  },

  timestamp: {
    fontFamily:
      theme.typography.regular,
    fontSize:
      theme.typography.small,
    color:
      theme.colors.textSecondary,
    textAlign: 'center',
  },
})
