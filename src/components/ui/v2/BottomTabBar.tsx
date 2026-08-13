import {
  Pressable,
  StyleSheet,
  View,
} from 'react-native'

import Ionicons from '@expo/vector-icons/Ionicons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Text } from '@/components/ui'
import { theme } from '@/theme'

export type BottomTabKey =
  | 'home'
  | 'measurements'
  | 'profile'
  | 'more'

type BottomTabBarProps = {
  activeTab: BottomTabKey
  onTabPress: (tab: BottomTabKey) => void
}

const tabs: {
  key: BottomTabKey
  label: string
  icon: keyof typeof Ionicons.glyphMap
  activeIcon: keyof typeof Ionicons.glyphMap
}[] = [
  {
    key: 'home',
    label: 'Inicio',
    icon: 'home-outline',
    activeIcon: 'home',
  },
  {
    key: 'measurements',
    label: 'Registros',
    icon: 'list-outline',
    activeIcon: 'list',
  },
  {
    key: 'profile',
    label: 'Perfil',
    icon: 'person-outline',
    activeIcon: 'person',
  },
  {
    key: 'more',
    label: 'Más',
    icon: 'ellipsis-horizontal',
    activeIcon: 'ellipsis-horizontal',
  },
]

export function BottomTabBar({
  activeTab,
  onTabPress,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets()

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom:
            insets.bottom + theme.spacing.sm,
          minHeight:
            72 + insets.bottom,
        },
      ]}
    >
      {tabs.map((tab) => {
        const active = tab.key === activeTab

        return (
          <Pressable
            key={tab.key}
            accessibilityRole="button"
            accessibilityState={{
              selected: active,
            }}
            accessibilityLabel={tab.label}
            onPress={() => onTabPress(tab.key)}
            style={({ pressed }) => [
              styles.tab,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons
              name={
                active
                  ? tab.activeIcon
                  : tab.icon
              }
              size={22}
              color={
                active
                  ? theme.colors.primary
                  : theme.colors.textSecondary
              }
            />

            <Text
              style={[
                styles.label,
                active && styles.activeLabel,
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.border,
  },

  tab: {
    flex: 1,
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
  },

  pressed: {
    opacity: 0.65,
  },

  label: {
    fontFamily: theme.typography.medium,
    fontSize: theme.typography.small,
    color: theme.colors.textSecondary,
  },

  activeLabel: {
    fontFamily: theme.typography.semiBold,
    color: theme.colors.primary,
  },
})
