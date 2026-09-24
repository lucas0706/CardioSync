import {
  StyleSheet,
  View,
} from 'react-native'

import {
  Card,
  Text,
} from '@/components/ui'

import {
  BloodPressureClassifier,
} from '@/domain/clinical/classification'

import { theme } from '@/theme'

type Props = {
  averageSystolic: number | null
  averageDiastolic: number | null
}

export function WeeklyCardiovascularStatusCard({
  averageSystolic,
  averageDiastolic,
}: Props) {
  if (
    averageSystolic == null ||
    averageDiastolic == null
  ) {
    return null
  }

  const classification =
    BloodPressureClassifier.classify(
      averageSystolic,
      averageDiastolic,
    )

  const description =
    classification.category === 'normal'
      ? 'Tus valores promedio de los últimos 7 días se encuentran dentro del rango recomendado.'
      : classification.category === 'borderline'
        ? 'Tus valores promedio muestran cifras elevadas que requieren seguimiento.'
        : classification.category === 'grade-1'
          ? 'Tus valores promedio corresponden a hipertensión arterial nivel 1.'
          : classification.category === 'grade-2'
            ? 'Tus valores promedio corresponden a hipertensión arterial nivel 2.'
            : 'Tus valores promedio corresponden a hipertensión sistólica aislada.'

  return (
    <Card style={styles.card}>
      <Text style={styles.title}>
        ❤️ Estado cardiovascular semanal
      </Text>

      <Text
        style={[
          styles.status,
          {
            color:
              classification.color,
          },
        ]}
      >
        {classification.label}
      </Text>

      <Text style={styles.description}>
        {description}
      </Text>

      <RiskScaleBar
        category={
          classification.category
        }
      />

      <View style={styles.scale}>
        <Chip
          label="Normal"
          active={
            classification.category ===
            'normal'
          }
          color="#16A34A"
        />

        <Chip
          label="Elevada"
          active={
            classification.category ===
            'borderline'
          }
          color="#CA8A04"
        />

        <Chip
          label="HTA 1"
          active={
            classification.category ===
            'grade-1'
          }
          color="#EA580C"
        />

        <Chip
          label="HTA 2"
          active={
            classification.category ===
            'grade-2'
          }
          color="#DC2626"
        />
      </View>
    </Card>
  )
}

type ChipProps = {
  label: string
  active: boolean
  color: string
}

function Chip({
  label,
  active,
  color,
}: ChipProps) {
  return (
    <View
      style={[
        styles.chip,
        active && {
          backgroundColor:
            color + '20',
          borderColor: color,
        },
      ]}
    >
      <Text
        style={[
          styles.chipText,
          active && {
            color,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  )
}

type RiskScaleBarProps = {
  category:
    | 'normal'
    | 'borderline'
    | 'grade-1'
    | 'grade-2'
    | 'isolated-systolic'
}

function RiskScaleBar({
  category,
}: RiskScaleBarProps) {
  const activeOpacity = 1
  const inactiveOpacity = 0.25

  return (
    <View style={styles.riskBar}>
      <View
        style={[
          styles.segment,
          styles.normalSegment,
          {
            opacity:
              category === 'normal'
                ? activeOpacity
                : inactiveOpacity,
          },
        ]}
      />

      <View
        style={[
          styles.segment,
          styles.borderlineSegment,
          {
            opacity:
              category === 'borderline'
                ? activeOpacity
                : inactiveOpacity,
          },
        ]}
      />

      <View
        style={[
          styles.segment,
          styles.grade1Segment,
          {
            opacity:
              category === 'grade-1'
                ? activeOpacity
                : inactiveOpacity,
          },
        ]}
      />

      <View
        style={[
          styles.segment,
          styles.grade2Segment,
          {
            opacity:
              category === 'grade-2' ||
              category ===
                'isolated-systolic'
                ? activeOpacity
                : inactiveOpacity,
          },
        ]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    gap: theme.spacing.sm,
  },

  title: {
    fontFamily:
      theme.typography.semiBold,
    fontSize:
      theme.typography.body,
    color:
      theme.colors.text,
  },

  status: {
    fontFamily:
      theme.typography.bold,
    fontSize: 18,
  },

  description: {
    fontFamily:
      theme.typography.regular,
    fontSize:
      theme.typography.caption,
    color:
      theme.colors.textSecondary,
    lineHeight: 20,
  },

  riskBar: {
    flexDirection: 'row',
    marginTop: 4,
    overflow: 'hidden',
    borderRadius: 999,
  },

  segment: {
    flex: 1,
    height: 12,
  },

  normalSegment: {
    backgroundColor: '#16A34A',
  },

  borderlineSegment: {
    backgroundColor: '#CA8A04',
  },

  grade1Segment: {
    backgroundColor: '#EA580C',
  },

  grade2Segment: {
    backgroundColor: '#DC2626',
  },

  scale: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    flexWrap: 'wrap',
    gap: 6,
  },

  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor:
      theme.colors.border,
    backgroundColor:
      theme.colors.surface,
  },

  chipText: {
    fontFamily:
      theme.typography.medium,
    fontSize: 12,
    color:
      theme.colors.textSecondary,
  },
})
