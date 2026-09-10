import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

interface WaveBackgroundProps {
  height?: number;
}

export function WaveBackground({
  height = 220,
}: WaveBackgroundProps): React.JSX.Element {
  return (
    <View
      pointerEvents="none"
      style={[styles.container, { height }]}
    >
      <Svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
      >
        <Path
          d={`
            M0 80
            C120 30 240 140 390 90
            C520 50 650 120 ${width} 70
            L${width} 0
            L0 0
            Z
          `}
          fill="#DBEAFE"
          opacity={0.9}
        />

        <Path
          d={`
            M0 120
            C160 70 280 170 430 120
            C560 80 700 160 ${width} 110
            L${width} 0
            L0 0
            Z
          `}
          fill="#93C5FD"
          opacity={0.45}
        />

        <Path
          d={`
            M0 160
            C140 120 280 220 430 170
            C560 130 700 220 ${width} 170
            L${width} 0
            L0 0
            Z
          `}
          fill="#2563EB"
          opacity={0.15}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
});
