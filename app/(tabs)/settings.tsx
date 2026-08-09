import { router } from 'expo-router'

import {
  Screen,
  Text,
  Card,
  Button,
} from '@/components/ui'

export default function SettingsScreen() {
  return (
    <Screen>
      <Card>
        <Text variant="h1">
          Configuración
        </Text>

        <Text>
          Configurá los datos personales y
          clínicos que podrán utilizarse para
          contextualizar futuros análisis.
        </Text>

        <Button
          title="Perfil clínico"
          onPress={() =>
            router.push('../profile')
          }
        />
      </Card>
    </Screen>
  )
}
