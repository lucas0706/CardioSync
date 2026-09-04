import * as FileSystem from 'expo-file-system/legacy'

import {
  getGoogleAccessToken,
  isGoogleSignedIn,
} from '@/core/auth/googleAuthService'

import {
  createSQLiteBackup,
  deleteTemporarySQLiteBackup,
  getBackupMimeType,
} from './SQLiteBackupService'

const GOOGLE_DRIVE_UPLOAD_URL =
  'https://www.googleapis.com/upload/drive/v3/files'

const GOOGLE_DRIVE_FILES_URL =
  'https://www.googleapis.com/drive/v3/files'

const DRIVE_FOLDER_NAME =
  'CardioSync Backups'

const BACKUP_PREFIX =
  'CardioSync_backup_'

export type GoogleDriveBackupResult = {
  fileId: string
  fileName: string
  sizeBytes: number
  measurementCount: number
}

type GoogleDriveFileResponse = {
  id?: string
  name?: string
  size?: string
  mimeType?: string
  createdTime?: string
}

type GoogleDriveListResponse = {
  files?: GoogleDriveFileResponse[]
}

function createBackupFileName(): string {
  const now = new Date()

  const year =
    now.getFullYear()

  const month =
    String(now.getMonth() + 1).padStart(
      2,
      '0',
    )

  const day =
    String(now.getDate()).padStart(
      2,
      '0',
    )

  const hour =
    String(now.getHours()).padStart(
      2,
      '0',
    )

  const minute =
    String(now.getMinutes()).padStart(
      2,
      '0',
    )

  const second =
    String(now.getSeconds()).padStart(
      2,
      '0',
    )

  return `${BACKUP_PREFIX}${year}-${month}-${day}_${hour}-${minute}-${second}.db`
}

async function getAccessToken(): Promise<string> {
  const signedIn =
    await isGoogleSignedIn()

  if (!signedIn) {
    throw new Error(
      'Google Drive no está conectado.',
    )
  }

  const accessToken =
    await getGoogleAccessToken()

  if (!accessToken) {
    throw new Error(
      'No se pudo obtener el token de acceso de Google.',
    )
  }

  return accessToken
}

async function findBackupFolder(
  accessToken: string,
): Promise<string | null> {
  const query =
    encodeURIComponent(
      `name = '${DRIVE_FOLDER_NAME}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    )

  const response =
    await fetch(
      `${GOOGLE_DRIVE_FILES_URL}?q=${query}&spaces=drive&fields=files(id,name,mimeType)`,
      {
        headers: {
          Authorization:
            `Bearer ${accessToken}`,
        },
      },
    )

  if (!response.ok) {
    const body =
      await response.text()

    throw new Error(
      `No se pudo consultar Google Drive (${response.status}): ${body}`,
    )
  }

  const data =
    (await response.json()) as GoogleDriveListResponse

  return data.files?.[0]?.id ?? null
}

async function createBackupFolder(
  accessToken: string,
): Promise<string> {
  const response =
    await fetch(
      GOOGLE_DRIVE_FILES_URL,
      {
        method: 'POST',
        headers: {
          Authorization:
            `Bearer ${accessToken}`,
          'Content-Type':
            'application/json',
        },
        body: JSON.stringify({
          name: DRIVE_FOLDER_NAME,
          mimeType:
            'application/vnd.google-apps.folder',
        }),
      },
    )

  if (!response.ok) {
    const body =
      await response.text()

    throw new Error(
      `No se pudo crear la carpeta de Google Drive (${response.status}): ${body}`,
    )
  }

  const data =
    (await response.json()) as GoogleDriveFileResponse

  if (!data.id) {
    throw new Error(
      'Google Drive creó la carpeta pero no devolvió su ID.',
    )
  }

  return data.id
}

async function getOrCreateBackupFolder(
  accessToken: string,
): Promise<string> {
  const existingFolder =
    await findBackupFolder(accessToken)

  if (existingFolder) {
    return existingFolder
  }

  return createBackupFolder(accessToken)
}

function createMultipartBody(
  metadata: Record<string, unknown>,
  fileBase64: string,
): {
  body: string
  boundary: string
} {
  const boundary =
    `cardiosync-${Date.now()}`

  const metadataJson =
    JSON.stringify(metadata)

  const body =
    [
      `--${boundary}`,
      'Content-Type: application/json; charset=UTF-8',
      '',
      metadataJson,
      `--${boundary}`,
      `Content-Type: ${getBackupMimeType()}`,
      'Content-Transfer-Encoding: base64',
      '',
      fileBase64,
      `--${boundary}--`,
      '',
    ].join('\r\n')

  return {
    body,
    boundary,
  }
}

async function uploadBackupFile(
  accessToken: string,
  databaseUri: string,
  fileName: string,
  folderId: string,
): Promise<string> {
  const fileBase64 =
    await FileSystem.readAsStringAsync(
      databaseUri,
      {
        encoding:
          FileSystem.EncodingType.Base64,
      },
    )

  const {
    body,
    boundary,
  } =
    createMultipartBody(
      {
        name: fileName,
        parents: [folderId],
      },
      fileBase64,
    )

  const response =
    await fetch(
      `${GOOGLE_DRIVE_UPLOAD_URL}?uploadType=multipart&fields=id,name,size`,
      {
        method: 'POST',
        headers: {
          Authorization:
            `Bearer ${accessToken}`,
          'Content-Type':
            `multipart/related; boundary="${boundary}"`,
        },
        body,
      },
    )

  if (!response.ok) {
    const responseBody =
      await response.text()

    throw new Error(
      `No se pudo subir la copia a Google Drive (${response.status}): ${responseBody}`,
    )
  }

  const data =
    (await response.json()) as GoogleDriveFileResponse

  if (!data.id) {
    throw new Error(
      'Google Drive no devolvió el ID del archivo subido.',
    )
  }

  return data.id
}

async function findBackupFiles(
  accessToken: string,
  folderId: string,
): Promise<GoogleDriveFileResponse[]> {
  const query =
    encodeURIComponent(
      `'${folderId}' in parents and name contains '${BACKUP_PREFIX}' and trashed = false`,
    )

  const response =
    await fetch(
      `${GOOGLE_DRIVE_FILES_URL}?q=${query}&spaces=drive&orderBy=createdTime desc&fields=files(id,name,size,mimeType,createdTime)`,
      {
        headers: {
          Authorization:
            `Bearer ${accessToken}`,
        },
      },
    )

  if (!response.ok) {
    const body =
      await response.text()

    throw new Error(
      `No se pudieron consultar las copias anteriores de Google Drive (${response.status}): ${body}`,
    )
  }

  const data =
    (await response.json()) as GoogleDriveListResponse

  return data.files ?? []
}

async function deleteBackupFile(
  accessToken: string,
  fileId: string,
): Promise<void> {
  const response =
    await fetch(
      `${GOOGLE_DRIVE_FILES_URL}/${encodeURIComponent(fileId)}`,
      {
        method: 'DELETE',
        headers: {
          Authorization:
            `Bearer ${accessToken}`,
        },
      },
    )

  if (!response.ok && response.status !== 404) {
    const body =
      await response.text()

    throw new Error(
      `No se pudo eliminar una copia anterior de Google Drive (${response.status}): ${body}`,
    )
  }
}

async function removePreviousBackups(
  accessToken: string,
  folderId: string,
  currentFileId: string,
): Promise<void> {
  const files =
    await findBackupFiles(
      accessToken,
      folderId,
    )

  const previousFiles =
    files.filter(
      (file) =>
        file.id &&
        file.id !== currentFileId,
    )

  for (const file of previousFiles) {
    if (!file.id) {
      continue
    }

    await deleteBackupFile(
      accessToken,
      file.id,
    )
  }
}

export async function createGoogleDriveBackup(): Promise<
  GoogleDriveBackupResult
> {
  const accessToken =
    await getAccessToken()

  const backup =
    await createSQLiteBackup()

  const fileName =
    createBackupFileName()

  try {
    const folderId =
      await getOrCreateBackupFolder(
        accessToken,
      )

    /*
     * Primero subimos la nueva copia.
     *
     * Si esta operación falla, no eliminamos
     * ninguna copia anterior.
     */
    const fileId =
      await uploadBackupFile(
        accessToken,
        backup.databaseUri,
        fileName,
        folderId,
      )

    /*
     * La nueva copia ya fue aceptada por Google Drive.
     * Recién ahora eliminamos las copias anteriores.
     */
    await removePreviousBackups(
      accessToken,
      folderId,
      fileId,
    )

    return {
      fileId,
      fileName,
      sizeBytes:
        backup.sizeBytes,
      measurementCount:
        backup.measurementCount,
    }
  } finally {
    await deleteTemporarySQLiteBackup()
  }
}
