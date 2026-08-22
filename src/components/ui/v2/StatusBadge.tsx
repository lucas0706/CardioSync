import {
  Animated,
  Easing,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'
import {
  useEffect,
  useRef,
} from 'react'

import { Text } from '@/components/ui'
import { theme } from '@/theme'

type StatusBadgeProps = {
  label: string
  color?: string
  style?: StyleProp<ViewStyle>
}

export function StatusBadge({
  label,
  color = theme.colors.primary,
  style,
}: StatusBadgeProps) {
  const pulse = useRef(
    new Animated.Value(0),
  ).current

  useEffect(() => {
    const animation =
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1,
            duration: 900,
            easing:
              Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulse, {
            toValue: 0,
            duration: 900,
            easing:
              Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.delay(700),
        ]),
      )

    animation.start()

    return () => {
      animation.stop()
    }
  }, [pulse])

  const dotScale =
    pulse.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.35],
    })

  const dotOpacity =
    pulse.interpolate({
      inputRange: [0, 1],
      outputRange: [0.72, 1],
    })

  const glowOpacity =
    pulse.interpolate({
      inputRange: [0, 1],
      outputRange: [0.05, 0.32],
    })

  const glowScale =
    pulse.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.8],
    })

  return (
    <View style={[styles.container, style]}>
      <View style={styles.dotContainer}>
        <Animated.View
          style={[
            styles.glow,
            {
              backgroundColor: color,
              opacity: glowOpacity,
              transform: [
                {
                  scale: glowScale,
                },
              ],
            },
          ]}
        />

        <Animated.View
          style={[
            styles.dot,
            {
              backgroundColor: color,
              opacity: dotOpacity,
              transform: [
                {
                  scale: dotScale,
                },
              ],
            },
          ]}
        />
      </View>

      <Text
        style={[
          styles.label,
          {
            color,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.round,
    backgroundColor: theme.colors.background,
  },

  dotContainer: {
    width: 10,
    height: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  glow: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: theme.radius.round,
  },

  dot: {
    width: 7,
    height: 7,
    borderRadius: theme.radius.round,
  },

  label: {
    fontFamily: theme.typography.semiBold,
    fontSize: theme.typography.caption,
  },
})
