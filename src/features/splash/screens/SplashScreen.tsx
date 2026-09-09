import {
  View,
  Text,
  Image,
  StyleSheet,
} from 'react-native'

import Svg, {
  Path,
} from 'react-native-svg'

import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'

import { useEffect } from 'react'

import { colors } from '@/theme/colors'

const AnimatedPath = Animated.createAnimatedComponent(Path)

export default function SplashScreen() {
  const progress = useSharedValue(0)

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, {
        duration: 2200,
        easing: Easing.linear,
      }),
      -1,
      false,
    )
  }, [progress])

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: 400 - progress.value * 400,
  }))

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../../assets/images/icon.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>
        CardioSync
      </Text>

      <Text style={styles.subtitle}>
        Monitoreo inteligente de presión arterial
      </Text>

      <Svg
        width={380}
        height={90}
      >
        <AnimatedPath
          animatedProps={animatedProps}
          d="M0 40 L60 40 L75 28 L90 40 L150 40 L170 8 L185 70 L200 20 L215 40 L280 40 L295 28 L310 40 L380 40"
          fill="none"
          stroke={colors.primary}
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="400"
        />
      </Svg>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  logo: {
    width: 140,
    height: 140,
    marginBottom: 28,
  },

  title: {
    fontSize: 34,
    fontFamily: 'DMSans_700Bold',
    color: colors.text,
    marginBottom: 10,
  },

  subtitle: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'DMSans_400Regular',
    color: colors.textSecondary,
    marginBottom: 56,
    maxWidth: 280,
  },
})
