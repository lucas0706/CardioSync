import {
  ActivityIndicator,
  Linking,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'

import { useEffect } from 'react'

import {
  Button,
  Card,
  Screen,
  Text,
} from '@/components/ui'

import { useAppUpdate }
  from '../hooks/useAppUpdate'

import { theme } from '@/theme'

export default function UpdateScreen() {
  const {
    checking,
    result,
    checkForUpdate,
  } = useAppUpdate()

  useEffect(() => {
    void checkForUpdate()
  }, [checkForUpdate])

  const statusLabel =
    result?.updateAvailable
      ? '🟠 Actualización disponible'
      : '🟢 Aplicación actualizada'

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>
              Actualizaciones
            </Text>

            <Text style={styles.subtitle}>
              Verificar nuevas versiones de
              CardioSync publicadas en GitHub.
            </Text>
          </View>

          {checking ? (
            <Card>
              <View style={styles.centered}>
                <ActivityIndicator />

                <Text>
                  Buscando actualizaciones...
                </Text>
              </View>
            </Card>
          ) : null}

          {!checking && !result ? (
            <Card>
              <Text style={styles.error}>
                No fue posible consultar la
                última versión disponible.
              </Text>

              <View style={styles.actions}>
                <Button
                  title="Reintentar"
                  onPress={() => {
                    void checkForUpdate()
                  }}
                />
              </View>
            </Card>
          ) : null}

          {result ? (
            <>
              <Card>
                <Text style={styles.sectionTitle}>
                  Estado
                </Text>

                <Text>
                  Versión instalada:{' '}
                  {result.currentVersion}
                </Text>

                <Text>
                  Última versión:{' '}
                  {result.latestVersion}
                </Text>

                <Text style={styles.status}>
                  {statusLabel}
                </Text>
              </Card>

              <Card>
                <Text style={styles.sectionTitle}>
                  Novedades
                </Text>

                <Text>
                  {result.releaseNotes ||
                    'Sin notas de lanzamiento.'}
                </Text>
              </Card>

              <Card>
                <Text style={styles.sectionTitle}>
                  Acciones
                </Text>

                <View style={styles.actions}>
                  <Button
                    title="Ver Release"
                    onPress={() => {
                      void Linking.openURL(
                        result.releaseUrl,
                      )
                    }}
                  />
                </View>

                {result.apkDownloadUrl ? (
                  <View style={styles.actions}>
                    <Button
                      title="Descargar APK"
                      onPress={() => {
                        void Linking.openURL(
                          result.apkDownloadUrl!,
                        )
                      }}
                    />
                  </View>
                ) : null}

                <View style={styles.actions}>
                  <Button
                    title="Verificar nuevamente"
                    onPress={() => {
                      void checkForUpdate()
                    }}
                  />
                </View>
              </Card>
            </>
          ) : null}
        </View>
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    paddingBottom: 40,
  },

  header: {
    gap: 8,
  },

  title: {
    fontFamily:
      theme.typography.bold,
    fontSize: 28,
  },

  subtitle: {
    color:
      theme.colors.textSecondary,
  },

  sectionTitle: {
    marginBottom: 12,
    fontFamily:
      theme.typography.semiBold,
  },

  centered: {
    alignItems: 'center',
    gap: 12,
  },

  status: {
    marginTop: 8,
    fontFamily:
      theme.typography.semiBold,
  },

  error: {
    color: theme.colors.text,
  },

  actions: {
    marginTop: 12,
  },
})
