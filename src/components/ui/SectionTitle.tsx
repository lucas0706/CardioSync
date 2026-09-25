import { StyleSheet, View, ViewProps } from 'react-native'

import { Text } from './Text'

type Props = ViewProps & {
  title: string
  subtitle?: string
}

export function SectionTitle({
  title,
  subtitle,
  style,
  ...props
}: Props) {
  return (
    <View
      style={[styles.container, style]}
      {...props}
    >
      <Text variant="h2" style={styles.title}>
        {title}
      </Text>

      {subtitle ? (
        <Text variant="body" style={styles.subtitle}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 4,
    marginBottom: 20,
  },

  title: {
    fontWeight: '700',
  },

  subtitle: {
    opacity: 0.7,
  },
})
