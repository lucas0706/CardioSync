import React, { useEffect } from 'react'
import { View, Dimensions, StyleSheet } from 'react-native'
import Svg, { Path } from 'react-native-svg'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'

const { width } = Dimensions.get('window')

const AnimatedView =
  Animated.createAnimatedComponent(View)

function Layer({
  color,
  opacity,
  direction,
  top,
  path,
}: {
  color: string
  opacity: number
  direction: 1 | -1
  top: number
  path: string
}) {
  const x = useSharedValue(0)

  useEffect(() => {
    x.value = withRepeat(
      withTiming(direction * 120, {
        duration: 7000,
      }),
      -1,
      true,
    )
  }, [direction])

  const style =
    useAnimatedStyle(() => ({
      transform: [
        {
          translateX: x.value,
        },
      ],
    }))

  return (
    <AnimatedView
      style={[
        styles.layer,
        style,
        { top },
      ]}
    >
      <Svg
        width={width + 500}
        height={420}
        viewBox={`0 0 ${width + 500} 420`}
      >
        <Path
          d={path}
          fill={color}
          opacity={opacity}
        />
      </Svg>
    </AnimatedView>
  )
}


export function WaveBackground() {
  return (
    <View style={styles.container}>
      <Layer
        top={-120}
        direction={1}
        color="#F0F9FF"
        opacity={0.9}
        path="
          M0 130
          C140 20 260 210 420 110
          C600 0 760 220 980 80
          C1180 10 1340 180 1500 90
          L1500 420
          L0 420
          Z
        "
      />

      <Layer
        top={-80}
        direction={-1}
        color="#E0F2FE"
        opacity={0.85}
        path="
          M0 110
          C220 200 360 20 560 130
          C760 240 940 40 1180 120
          C1340 180 1460 80 1600 120
          L1600 420
          L0 420
          Z
        "
      />

      <Layer
        top={-40}
        direction={1}
        color="#BAE6FD"
        opacity={0.8}
        path="
          M0 150
          C180 70 420 250 700 120
          C920 20 1180 260 1460 110
          C1640 30 1820 180 2000 120
          L2000 420
          L0 420
          Z
        "
      />
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    height: 520,
    width: '100%',
    overflow: 'hidden',
  },

  layer: {
    position: 'absolute',
    left: -250,
  },
})
