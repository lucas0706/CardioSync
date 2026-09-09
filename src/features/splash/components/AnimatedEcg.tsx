import {
  Animated,
  Easing,
  StyleSheet,
  View,
} from 'react-native'
import { useEffect, useRef } from 'react'

import { colors } from '@/theme/colors'

export function AnimatedEcg() {
  const translateX = useRef(
    new Animated.Value(-220)
  ).current

  useEffect(() => {
    Animated.loop(
      Animated.timing(translateX, {
        toValue: 220,
        duration: 1800,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start()
  }, [translateX])

  return (
    <View style={styles.container}>
      <View style={styles.line}>
        <Animated.View
          style={[
            styles.pulse,
            {
              transform: [{ translateX }],
            },
          ]}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 220,
    height: 40,
    justifyContent: 'center',
  },

  line: {
    height: 3,
    borderRadius: 2,
    backgroundColor: '#DCEAFE',
    overflow: 'hidden',
  },

  pulse: {
    position: 'absolute',
    width: 40,
    height: 3,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
})
