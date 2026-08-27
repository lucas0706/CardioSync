import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin'

const WEB_CLIENT_ID =
  '204307583100-504qtem95cmt2e7jcmfdpjt3tjhmuvb2.apps.googleusercontent.com'

const DRIVE_SCOPE =
  'https://www.googleapis.com/auth/drive.file'

let configured = false

export type GoogleAccount = {
  id: string | null
  email: string | null
  name: string | null
}

function ensureConfigured(): void {
  if (configured) {
    return
  }

  GoogleSignin.configure({
    webClientId: WEB_CLIENT_ID,
    scopes: [DRIVE_SCOPE],
  })

  configured = true
}

export async function signInWithGoogle() {
  ensureConfigured()

  await GoogleSignin.hasPlayServices({
    showPlayServicesUpdateDialog: true,
  })

  return GoogleSignin.signIn()
}

export async function signOutFromGoogle(): Promise<void> {
  ensureConfigured()

  await GoogleSignin.signOut()
}

export async function isGoogleSignedIn(): Promise<boolean> {
  ensureConfigured()

  return (
    (await GoogleSignin.getCurrentUser()) !== null
  )
}

export async function getGoogleCurrentUser(): Promise<
  GoogleAccount | null
> {
  ensureConfigured()

  const user =
    await GoogleSignin.getCurrentUser()

  if (!user) {
    return null
  }

  return {
    id: user.user.id ?? null,
    email: user.user.email ?? null,
    name: user.user.name ?? null,
  }
}

export async function getGoogleAccessToken(): Promise<string | null> {
  ensureConfigured()

  const response =
    await GoogleSignin.getTokens()

  return response.accessToken ?? null
}

export function isGoogleSignInCancelled(
  error: unknown,
): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === statusCodes.SIGN_IN_CANCELLED
  )
}
