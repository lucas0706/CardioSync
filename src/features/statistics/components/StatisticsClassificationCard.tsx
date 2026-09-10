import {
  StyleSheet,
  View,
} from 'react-native'

import { Card, Text } from '@/components/ui'
import { theme } from '@/theme'

import {
  BloodPressureClassifier,
} from '@/domain/clinical/classification'

import type {
  BloodPressureCategory,
} from '@/domain/clinical/classification'

interface Props {
  distribution?: Record<string, number>
}

export function StatisticsClassificationCard({
  distribution,
}: Props) {
  if (!distribution) {
    return null
  }

  const entries = Object.entries(
    distribution,
  )

  if (entries.length === 0) {
    return null
  }

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.overline}>
          CLASIFICACIÓN
        </Text>

        <Text style={styles.title}>
          Distribución de tus mediciones
        </Text>
      </View>

      <View style={styles.list}>
        {entries
          .sort((a, b) => b[1] - a[1])
          .map(([category, count]) => {
            const classification =
              BloodPressureClassifier.getClassification(
                category as BloodPressureCategory,
              )

            return (
              <View
                key={category}
                style={styles.row}
              >
                <Text
                  style={styles.label}
                >
                  {classification.label}
                </Text>

                <Text
                  style={styles.value}
                >
                  {count}
                </Text>
              </View>
            )
          })}
      </View>
    </Card>
  )
}

const styles = StyleSheet.create({
  card: {
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },

  header: {
    gap: theme.spacing.xs,
  },

  overline: {
    fontFamily:
      theme.typography.semiBold,
    fontSize:
      theme.typography.overline,
    letterSpacing: 0.5,
    color:
      theme.colors.textSecondary,
  },

  title: {
    fontFamily:
      theme.typography.semiBold,
    fontSize:
      theme.typography.title,
    color:
      theme.colors.text,
  },

  list: {
    gap: theme.spacing.sm,
  },

  row: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical:
      theme.spacing.xs,
    borderBottomWidth:
      StyleSheet.hairlineWidth,
    borderBottomColor:
      theme.colors.border,
  },

  label: {
    fontFamily:
      theme.typography.medium,
    fontSize:
      theme.typography.body,
    color:
      theme.colors.text,
  },

  value: {
    fontFamily:
      theme.typography.bold,
    fontSize:
      theme.typography.title,
    color:
      theme.colors.text,
  },
})
