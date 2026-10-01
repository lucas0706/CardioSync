import {
  StyleSheet,
  View,
} from 'react-native'

import { Text } from '@/components/ui/Text'
import { theme } from '@/theme'

export function UpdateBanner() {
  return (
    <View style={styles.container}>
      <Text
        variant="body"
        style={styles.title}
      >
        ✅ CardioSync actualizado
      </Text>

      <Text
        variant="caption"
        style={styles.subtitle}
      >
        La aplicación se actualizó correctamente.
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',

    top: 16,
    left: 16,
    right: 16,

    zIndex: 9999,

    backgroundColor:
      theme.colors.success,

    borderRadius:
      theme.radius.md,

    padding: 16,
  },

  title: {
    color: theme.colors.white,
    fontFamily:
      theme.typography.bold,
  },

  subtitle: {
    color: theme.colors.white,
    marginTop: 4,
  },
})
