import {
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native'

import {
  useFocusEffect,
} from 'expo-router'

import {
  useCallback,
  useEffect,
  useMemo,
} from 'react'

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated'

import {
  MaterialCommunityIcons,
} from '@expo/vector-icons'

import {
  Card,
  Text,
} from '@/components/ui'

import {
  useHealthSummary,
} from '@/features/healthConnect'

import { theme } from '@/theme'

function AnimatedHeart() {
  const scale =
    useSharedValue(1)

  useEffect(() => {
    scale.value =
      withRepeat(
        withSequence(
          withTiming(
            1.15,
            {
              duration: 450,
            },
          ),
          withTiming(
            1,
            {
              duration: 450,
            },
          ),
        ),
        -1,
      )
  }, [scale])

  const style =
    useAnimatedStyle(() => ({
      transform: [
        {
          scale:
            scale.value,
        },
      ],
    }))

  return (
    <Animated.View style={style}>
      <MaterialCommunityIcons
        name="heart-pulse"
        size={22}
        color={
          theme.colors.primary
        }
      />
    </Animated.View>
  )
}

function AnimatedSteps() {
  const translateY =
    useSharedValue(0)

  useEffect(() => {
    translateY.value =
      withRepeat(
        withSequence(
          withTiming(
            -3,
            {
              duration: 350,
            },
          ),
          withTiming(
            0,
            {
              duration: 350,
            },
          ),
        ),
        -1,
      )
  }, [translateY])

  const style =
    useAnimatedStyle(() => ({
      transform: [
        {
          translateY:
            translateY.value,
        },
      ],
    }))

  return (
    <Animated.View style={style}>
      <MaterialCommunityIcons
        name="walk"
        size={22}
        color={
          theme.colors.primary
        }
      />
    </Animated.View>
  )
}

function AnimatedSleep() {
  const translateY =
    useSharedValue(0)

  useEffect(() => {
    translateY.value =
      withRepeat(
        withSequence(
          withTiming(
            -2,
            {
              duration: 1200,
            },
          ),
          withTiming(
            2,
            {
              duration: 1200,
            },
          ),
        ),
        -1,
        true,
      )
  }, [translateY])

  const style =
    useAnimatedStyle(() => ({
      transform: [
        {
          translateY:
            translateY.value,
        },
      ],
    }))

  return (
    <Animated.View style={style}>
      <MaterialCommunityIcons
        name="sleep"
        size={22}
        color={
          theme.colors.primary
        }
      />
    </Animated.View>
  )
}

export function HealthSummaryCard() {
  const {
    summary,
    loading,
    reload,
  } = useHealthSummary()

  useFocusEffect(
    useCallback(() => {
      void reload()
    }, [reload]),
  )

  const metrics =
    useMemo(
      () => [
        {
          label:
            'Último sueño',
          value:
            `${summary?.averageSleepHours ?? 0} h`,
          icon: (
            <AnimatedSleep />
          ),
        },
        {
          label:
            'Pasos del día',
          value:
            String(
              summary?.todaySteps ??
                0,
            ),
          icon: (
            <AnimatedSteps />
          ),
        },
        {
          label:
            'FC promedio',
          value:
            String(
              summary?.todayHeartRateAverage ??
                0,
            ),
          icon: (
            <AnimatedHeart />
          ),
        },
        {
          label:
            'Ejercicio hoy',
          value:
            `${summary?.exerciseMinutesToday ?? 0} min`,
          icon: (
            <MaterialCommunityIcons
              name="run"
              size={22}
              color={
                theme.colors.primary
              }
            />
          ),
        },

        {
          label:
            'Último peso',
          value:
            summary?.latestWeightKg !== undefined
              ? `${summary.latestWeightKg.toFixed(1)} kg`
              : '--',
          icon: (
            <MaterialCommunityIcons
              name="scale-bathroom"
              size={22}
              color={
                theme.colors.primary
              }
            />
          ),
        },

      ],
      [summary],
    )

  if (loading) {
    return (
      <Card style={styles.card}>
        <ActivityIndicator />
      </Card>
    )
  }

  if (!summary) {
    return null
  }

  return (
    <Card style={styles.card}>
      <Text style={styles.title}>
        Salud integrada
      </Text>

      <View style={styles.grid}>
        {metrics.map(
          metric => (
            <View
              key={
                metric.label
              }
              style={
                styles.item
              }
            >
              <View
                style={
                  styles.labelRow
                }
              >
                {metric.icon}

                <Text
                  style={
                    styles.label
                  }
                >
                  {
                    metric.label
                  }
                </Text>
              </View>

              <Text
                style={
                  styles.value
                }
              >
                {
                  metric.value
                }
              </Text>
            </View>
          ),
        )}
      </View>
    </Card>
  )
}

const styles = StyleSheet.create({
  card: {
    padding:
      theme.spacing.md,
    borderRadius:
      theme.radius.lg,
    backgroundColor:
      theme.colors.surface,
    borderWidth: 1,
    borderColor:
      theme.colors.border,
  },

  title: {
    marginBottom:
      theme.spacing.md,
    fontFamily:
      theme.typography.semiBold,
    fontSize:
      theme.typography.body,
    color:
      theme.colors.text,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap:
      theme.spacing.md,
  },

  item: {
    width: '48%',
    paddingRight: 8,
    marginBottom: 12,
  },

  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  label: {
    fontFamily:
      theme.typography.medium,
    fontSize:
      theme.typography.caption,
    color:
      theme.colors.textSecondary,
  },

  value: {
    marginTop: 4,
    marginLeft: 28,
    fontFamily:
      theme.typography.bold,
    fontSize: 22,
    color:
      theme.colors.text,
  },

  weightCard: {
    marginTop:
      theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  weightValue: {
    marginTop: 4,
    fontFamily:
      theme.typography.bold,
    fontSize: 24,
    color:
      theme.colors.text,
  },
})
