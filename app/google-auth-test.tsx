import { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import {
  getGoogleAccessToken,
  isGoogleSignInCancelled,
  signInWithGoogle,
  signOutFromGoogle,
} from '@/core/auth/googleAuthService'

export default function GoogleAuthTestScreen() {
  const [status, setStatus] = useState('No autenticado')
  const [accessToken, setAccessToken] = useState<string | null>(null)

  async function handleSignIn(): Promise<void> {
    try {
      setStatus('Iniciando sesión...')

      const result = await signInWithGoogle()

      const token = await getGoogleAccessToken()

      setAccessToken(token)
      setStatus(
        result.type === 'success'
          ? 'Autenticación exitosa'
          : `Resultado: ${result.type}`,
      )
    } catch (error) {
      if (isGoogleSignInCancelled(error)) {
        setStatus('Inicio de sesión cancelado')
        return
      }

      console.error('Google Sign-In error:', error)
      setStatus('Error durante la autenticación')
    }
  }

  async function handleSignOut(): Promise<void> {
    try {
      await signOutFromGoogle()
      setAccessToken(null)
      setStatus('Sesión cerrada')
    } catch (error) {
      console.error('Google Sign-Out error:', error)
      setStatus('Error al cerrar sesión')
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Google Sign-In</Text>

      <Text style={styles.status}>{status}</Text>

      <Text
        style={styles.button}
        onPress={handleSignIn}
      >
        Iniciar sesión con Google
      </Text>

      <Text
        style={styles.button}
        onPress={handleSignOut}
      >
        Cerrar sesión
      </Text>

      {accessToken ? (
        <Text style={styles.token}>
          Access token obtenido correctamente.
        </Text>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    padding: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
  },

  status: {
    fontSize: 16,
    textAlign: 'center',
  },

  button: {
    padding: 16,
    fontSize: 16,
    fontWeight: '600',
  },

  token: {
    fontSize: 14,
    textAlign: 'center',
  },
})
