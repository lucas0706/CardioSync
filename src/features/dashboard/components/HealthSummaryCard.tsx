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
        <View style={styles.item}>
          <View
            style={styles.labelRow}
          >
            <AnimatedSleep />

            <Text
              style={
                styles.label
              }
            >
              Último sueño
            </Text>
          </View>

          <Text style={styles.value}>
            {
              summary.averageSleepHours
            } h
          </Text>
        </View>

        <View style={styles.item}>
          <View
            style={styles.labelRow}
          >
            <AnimatedSteps />

            <Text
              style={
                styles.label
              }
            >
              Pasos del día
            </Text>
          </View>

          <Text style={styles.value}>
            {
              summary.averageDailySteps
            }
          </Text>
        </View>

        <View style={styles.item}>
          <View
            style={styles.labelRow}
          >
            <AnimatedHeart />

            <Text
              style={
                styles.label
              }
            >
              FC promedio
            </Text>
          </View>

          <Text style={styles.value}>
            {
              summary.averageRestingHeartRate
            }
          </Text>
        </View>
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
    width: '50%',
    paddingRight: 12,
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
})
