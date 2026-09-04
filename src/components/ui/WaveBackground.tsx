import { StyleSheet, View } from 'react-native'

import { MotiView } from 'moti'

function Blob({
  color,
  size,
  bottom,
  left,
  from,
  to,
  duration,
}: {
  color: string
  size: number
  bottom: number
  left: number
  from: number
  to: number
  duration: number
}) {
  return (
    <MotiView
      from={{
        translateX: from,
      }}
      animate={{
        translateX: to,
      }}
      transition={{
        type: 'timing',
        duration,
        loop: true,
      }}
      style={[
        styles.blob,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          bottom,
          left,
        },
      ]}
    />
  )
}

export function WaveBackground() {
  return (
    <View
      pointerEvents="none"
      style={styles.container}
    >
      <Blob
        color="#DBEAFE"
        size={900}
        bottom={-520}
        left={-450}
        from={-120}
        to={120}
        duration={4000}
      />

      <Blob
        color="#BFDBFE"
        size={1100}
        bottom={-700}
        left={120}
        from={-20}
        to={20}
        duration={10000}
      />

      <Blob
        color="#93C5FD"
        size={1300}
        bottom={-920}
        left={-250}
        from={-80}
        to={80}
        duration={8000}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 140,
    overflow: 'hidden',
    marginLeft: -120,
    marginRight: -120,
  },

  blob: {
    position: 'absolute',
    opacity: 0.55,
  },
})
