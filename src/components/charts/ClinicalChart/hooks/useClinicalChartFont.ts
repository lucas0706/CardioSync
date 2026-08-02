import { useFont } from '@shopify/react-native-skia'

export function useClinicalChartFont() {
  return useFont(
    require('../../../../../assets/fonts/SpaceMono-Regular.ttf'),
    11,
  )
}
