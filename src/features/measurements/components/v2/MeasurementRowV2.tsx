import { memo } from 'react'
import {
  Pressable,
  StyleSheet,
  View,
} from 'react-native'
import { useRouter } from 'expo-router'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import { Text } from '@/components/ui'
import { theme } from '@/theme'

import {
  BloodPressureClassifier,
} from '@/domain/clinical/classification'

import type {
  BloodPressureRecord,
} from '@/domain/measurements/BloodPressureRecord'

type MeasurementRowV2Props = {
  record: BloodPressureRecord
  alternate?: boolean
}

function formatDate(
  value: string,
): string {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '--/--'
  }

  return date.toLocaleDateString(
    'es-AR',
    {
      day: '2-digit',
      month: '2-digit',
    },
  )
}

function formatTime(
  value: string,
): string {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '--:--'
  }

  return date.toLocaleTimeString(
    'es-AR',
    {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    },
  )
}

function getArmLabel(
  arm?: BloodPressureRecord['arm'],
): string | null {
  if (arm === 'left') {
    return 'Izquierdo'
  }

  if (arm === 'right') {
    return 'Derecho'
  }

  return null
}

function getPositionLabel(
  position?: BloodPressureRecord['position'],
): string | null {
  if (position === 'sitting') {
    return 'Sentado'
  }

  if (position === 'standing') {
    return 'De pie'
  }

  if (position === 'lying') {
    return 'Acostado'
  }

  return null
}

function getClassificationLabel(
  category: ReturnType<
    typeof BloodPressureClassifier.classify
  >['category'],
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

function MeasurementRowV2Component({
  record,
  alternate = false,
}: MeasurementRowV2Props) {
  const router = useRouter()

  const classification =
    BloodPressureClassifier.classify(
      record.systolic,
      record.diastolic,
    )

  const arm =
    getArmLabel(record.arm)

  const position =
    getPositionLabel(record.position)

  const hasNote =
    Boolean(record.notes?.trim())

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Medición ${record.systolic} sobre ${record.diastolic}`}
      onPress={() =>
        router.push({
          pathname: '/measurement/[id]',
          params: {
            id: record.id,
          },
        })
      }
      style={({ pressed }) => [
        styles.container,
        alternate && styles.containerAlternate,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.topRow}>
        <Text
          numberOfLines={1}
          style={styles.pressure}
        >
          {record.systolic} / {record.diastolic} mmHg
        </Text>

        <View style={styles.classification}>
          <View
            style={[
              styles.dot,
              {
                backgroundColor:
                  classification.color,
              },
            ]}
          />

          <Text
            numberOfLines={1}
            style={[
              styles.classificationText,
              {
                color:
                  classification.color,
              },
            ]}
          >
            {getClassificationLabel(
              classification.category,
            )}
          </Text>
        </View>
      </View>

      <View style={styles.bottomRow}>
        <Text
          numberOfLines={1}
          style={styles.metaLeft}
        >
          FC {record.heartRate ?? '--'}
          {' · '}
          {formatDate(record.dateTime)}
          {' · '}
          {formatTime(record.dateTime)}
        </Text>

        <View style={styles.metaRight}>
          {arm ? (
            <Text
              numberOfLines={1}
              style={styles.metaText}
            >
              {arm}
            </Text>
          ) : null}

          {position ? (
            <Text
              numberOfLines={1}
              style={styles.metaText}
            >
              {arm ? ' · ' : ''}
              {position}
            </Text>
          ) : null}

          {hasNote ? (
            <MaterialCommunityIcons
              name="note-text-outline"
              size={16}
              color={theme.colors.textSecondary}
              accessibilityLabel="Tiene nota"
              style={styles.noteIcon}
            />
          ) : null}
        </View>
      </View>
    </Pressable>
  )
}

export const MeasurementRowV2 =
  memo(MeasurementRowV2Component)

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: 68,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
  },

  containerAlternate: {
    backgroundColor: '#F8FAFC',
  },

  pressed: {
    opacity: 0.72,
  },

  topRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },

  bottomRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.xs,
  },

  pressure: {
    flex: 1,
    fontFamily: theme.typography.semiBold,
    fontSize: 17,
    lineHeight: 20,
    color: theme.colors.text,
  },

  classification: {
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },

  dot: {
    width: 7,
    height: 7,
    marginRight: theme.spacing.xs,
    borderRadius: theme.radius.round,
  },

  classificationText: {
    fontFamily: theme.typography.semiBold,
    fontSize: theme.typography.caption,
    lineHeight: 17,
  },

  metaLeft: {
    flex: 1,
    fontFamily: theme.typography.regular,
    fontSize: theme.typography.caption,
    lineHeight: 17,
    color: theme.colors.textSecondary,
  },

  metaRight: {
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '52%',
  },

  metaText: {
    fontFamily: theme.typography.regular,
    fontSize: theme.typography.caption,
    lineHeight: 17,
    color: theme.colors.textSecondary,
  },

  noteIcon: {
    marginLeft: theme.spacing.xs,
  },
})
