import { useState } from 'react'

import {
  LayoutChangeEvent,
  StyleSheet,
  View,
} from 'react-native'

import { Text } from '@/components/ui'

type Props = {
  labels: string[]
  period: '7d' | '30d' | '90d'
  scrollX: number
}

const INITIAL_SPACING = 12

function getFixedSpacing(
  period: Props['period'],
): number | undefined {
  if (period === '7d') {
    return undefined
  }

  return period === '30d'
    ? 18
    : 6
}

export function ClinicalChartXAxisV3({
  labels,
  period,
  scrollX,
}: Props) {
  const [width, setWidth] =
    useState(0)

  function handleLayout(
    event: LayoutChangeEvent,
  ) {
    setWidth(
      event.nativeEvent.layout.width,
    )
  }

  const fixedSpacing =
    getFixedSpacing(period)

  const spacing =
    fixedSpacing ??
    (width - INITIAL_SPACING) /
      Math.max(
        labels.length - 1,
        1,
      )

  const visibleIndexes =
    period === '7d'
      ? labels.map((_, index) => index)
      : period === '30d'
        ? [0, 5, 10, 15, 20, 25, 29]
        : [0, 15, 30, 45, 60, 75, 89]

  return (
    <View
      onLayout={handleLayout}
      style={styles.viewport}
    >
      <View
        style={[
          styles.content,
          {
            transform: [
              {
                translateX:
                  INITIAL_SPACING -
                  scrollX,
              },
            ],
          },
        ]}
      >
        {visibleIndexes.map(index => {
          const label = labels[index]

          if (!label) {
            return null
          }

          return (
            <View
              key={`${index}-${label}`}
              style={[
                styles.labelContainer,
                {
                  left:
                    index * spacing,
                },
              ]}
            >
              <Text
                style={
                  period === '7d'
                    ? styles.label
                    : styles.rotatedLabel
                }
              >
                {label}
              </Text>
            </View>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  viewport: {
    position: 'relative',
    height: 64,
    width: '100%',
    overflow: 'hidden',
  },

  content: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 64,
  },

  labelContainer: {
    position: 'absolute',
    width: 54,
    alignItems: 'center',
  },

  label: {
    color: '#64748B',
    fontSize: 10,
    textAlign: 'center',
  },

  rotatedLabel: {
    color: '#64748B',
    fontSize: 10,
    width: 58,
    textAlign: 'left',
    transform: [
      {
        rotate: '-45deg',
      },
    ],
  },
})
