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
    : 18
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

  const shouldAdjustToWidth =
    labels.length <= 10

  const spacing =
    shouldAdjustToWidth && width > INITIAL_SPACING
      ? (width - INITIAL_SPACING) /
        Math.max(
          labels.length - 1,
          1,
        )
      : fixedSpacing ??
        (width - INITIAL_SPACING) /
          Math.max(
            labels.length - 1,
            1,
          )

  const referenceCount =
    period === '7d'
      ? labels.length
      : period === '30d'
        ? Math.min(10, labels.length)
        : Math.min(15, labels.length)

  const visibleIndexes =
    referenceCount <= 1
      ? [0]
      : Array.from(
          { length: referenceCount },
          (_, index) =>
            Math.round(
              (index *
                (labels.length - 1)) /
                (referenceCount - 1),
            ),
        ).filter(
          (index, position, array) =>
            index >= 0 &&
            index < labels.length &&
            array.indexOf(index) === position,
        )

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
