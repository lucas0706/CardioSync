import { Pressable, StyleSheet, Text } from 'react-native'

type Props = {
  onPress: () => void
}

export function FloatingActionButton({
  onPress,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
      ]}
    >
      <Text style={styles.icon}>+</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',

    right: 24,

    bottom: 24,

    width: 60,

    height: 60,

    borderRadius: 30,

    backgroundColor: '#2563EB',

    justifyContent: 'center',

    alignItems: 'center',

    elevation: 8,

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.25,

    shadowRadius: 8,
  },

  pressed: {
    transform: [
      {
        scale: 0.96,
      },
    ],
  },

  icon: {
    color: '#FFFFFF',

    fontSize: 34,

    fontWeight: '300',

    marginTop: -2,
  },
})
