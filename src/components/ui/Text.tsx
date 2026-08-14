import {
  Text as RNText,
  TextProps,
  StyleSheet,
} from 'react-native'

import { theme } from '@/theme'

type Props = TextProps & {
  variant?:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'title'
    | 'body'
    | 'caption'
    | 'small'
}

export function Text({
  variant = 'body',
  style,
  ...props
}: Props) {
  return (
    <RNText
      style={[
        styles.base,
        {
          fontSize:
            theme.typography[variant],
        },
        style,
      ]}
      {...props}
    />
  )
}

const styles = StyleSheet.create({
  base: {
    fontFamily:
      theme.typography.regular,
    color: theme.colors.text,
  },
})
