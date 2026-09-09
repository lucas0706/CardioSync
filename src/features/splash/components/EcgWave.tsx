import Svg, {
  Path,
} from 'react-native-svg'

type Props = {
  width?: number
  height?: number
}

export function EcgWave({
  width = 320,
  height = 70,
}: Props) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 320 70"
    >
      <Path
        d="
          M0 35

          L70 35

          L90 35
          L100 28
          L110 35

          L150 35

          L165 35
          L175 55
          L185 5
          L195 40
          L205 35

          L245 35

          L260 35
          L275 25
          L290 35

          L320 35
        "
        fill="none"
        stroke="#2563EB"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}
