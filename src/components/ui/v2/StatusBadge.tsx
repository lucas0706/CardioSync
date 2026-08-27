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

import Ionicons from '@expo/vector-icons/Ionicons'

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
          // Primer latido
          Animated.timing(pulse, {
            toValue: 1,
            duration: 130,
            easing: Easing.out(
              Easing.ease,
            ),
            useNativeDriver: true,
          }),

          Animated.timing(pulse, {
            toValue: 0.08,
            duration: 110,
            easing: Easing.inOut(
              Easing.ease,
            ),
            useNativeDriver: true,
          }),

          // Segundo latido, ligeramente más suave
          Animated.timing(pulse, {
            toValue: 0.72,
            duration: 115,
            easing: Easing.out(
              Easing.ease,
            ),
            useNativeDriver: true,
          }),

          Animated.timing(pulse, {
            toValue: 0,
            duration: 150,
            easing: Easing.inOut(
              Easing.ease,
            ),
            useNativeDriver: true,
          }),

          // Pausa entre latidos
          Animated.delay(850),
        ]),
      )

    animation.start()

    return () => {
      animation.stop()
    }
  }, [pulse])

  const heartScale =
    pulse.interpolate({
      inputRange: [0, 0.72, 1],
      outputRange: [1, 1.12, 1.28],
    })

  const heartOpacity =
    pulse.interpolate({
      inputRange: [0, 1],
      outputRange: [0.78, 1],
    })

  const glowOpacity =
    pulse.interpolate({
      inputRange: [0, 0.72, 1],
      outputRange: [0.05, 0.22, 0.34],
    })

  const glowScale =
    pulse.interpolate({
      inputRange: [0, 0.72, 1],
      outputRange: [1, 1.45, 1.85],
    })

  return (
    <View style={[styles.container, style]}>
      <View style={styles.heartContainer}>
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
          style={{
            opacity: heartOpacity,
            transform: [
              {
                scale: heartScale,
              },
            ],
          }}
        >
          <Ionicons
            name="heart"
            size={13}
            color={color}
          />
        </Animated.View>
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

  heartContainer: {
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  glow: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: theme.radius.round,
  },

  label: {
    fontFamily: theme.typography.semiBold,
    fontSize: theme.typography.caption,
  },
})
