import {
  Pressable,
  StyleSheet,
  View,
} from 'react-native'

import {
  useState,
} from 'react'

import { Card, Text } from '@/components/ui'
import { theme } from '@/theme'

interface StatisticsMetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  description?: string
}

export function StatisticsMetricCard({
  title,
  value,
  subtitle,
  description,
}: StatisticsMetricCardProps) {
  const [showDescription, setShowDescription] =
    useState(false)

  return (
    <Card style={styles.card}>
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.label}>
            {title}
          </Text>

          {description ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Información sobre ${title}`}
              accessibilityState={{
                expanded: showDescription,
              }}
              hitSlop={8}
              onPress={() =>
                setShowDescription(
                  current => !current,
                )
              }
              style={styles.infoButton}
            >
              <Text style={styles.infoText}>
                ?
              </Text>
            </Pressable>
          ) : null}
        </View>

        <Text
          style={[
            styles.value,
            typeof value === 'string' &&
              value.length > 8 &&
              styles.textValue,
          ]}
        >
          {value}
        </Text>

        {subtitle ? (
          <Text style={styles.subtitle}>
            {subtitle}
          </Text>
        ) : null}

        {showDescription &&
        description ? (
          <View style={styles.description}>
            <Text style={styles.descriptionText}>
              {description}
            </Text>
          </View>
        ) : null}
      </View>
    </Card>
  )
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 0,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    shadowOpacity: 0.05,
    elevation: 2,
  },

  content: {
    gap: theme.spacing.xs,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    minHeight: 18,
  },

  label: {
    flex: 1,
    fontFamily:
      theme.typography.medium,
    fontSize:
      theme.typography.overline,
    lineHeight: 14,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color:
      theme.colors.textSecondary,
  },

  infoButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor:
      theme.colors.textSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  infoText: {
    fontFamily:
      theme.typography.semiBold,
    fontSize: 12,
    lineHeight: 14,
    color:
      theme.colors.textSecondary,
  },

  value: {
    fontFamily:
      theme.typography.bold,
    fontSize:
      theme.typography.metric,
    lineHeight: 42,
    color:
      theme.colors.text,
  },

  textValue: {
    fontSize: 22,
    lineHeight: 28,
  },

  subtitle: {
    fontFamily:
      theme.typography.regular,
    fontSize:
      theme.typography.small,
    color:
      theme.colors.textSecondary,
  },

  description: {
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth:
      StyleSheet.hairlineWidth,
    borderTopColor:
      theme.colors.border,
  },

  descriptionText: {
    fontFamily:
      theme.typography.regular,
    fontSize:
      theme.typography.small,
    lineHeight: 18,
    color:
      theme.colors.textSecondary,
  },
})
