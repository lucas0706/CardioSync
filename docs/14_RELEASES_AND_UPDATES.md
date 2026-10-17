# Versiones, actualizaciones y distribución Android

Esta guía describe cómo comprobar y distribuir una versión de CardioSync para Android. Los valores de configuración deben verificarse en la rama y el commit exactos que se van a publicar; este documento no sustituye esa comprobación.

## Fuentes de configuración

La configuración consultada en la rama `main` el 2026-10-17 incluye:

- `app.json`: configuración estática de Expo y versión declarada.
- `package.json`: versión del paquete y versiones declaradas de dependencias.
- `eas.json`: perfiles de compilación y opciones de EAS Build.

En esta revisión, `app.config.js` no se encontró en la raíz del repositorio. Si se incorpora una configuración dinámica en otra ubicación o mediante otra herramienta, hay que verificarla antes de publicar.

## Estado observado en main — 2026-10-17

| Elemento | Valor encontrado | Alcance de la observación |
|---|---|---|
| Versión en `app.json` | `1.0.0` | Valor declarado en el archivo; no confirma por sí solo la versión remota de EAS ni la instalada en un dispositivo. |
| Versión en `package.json` | `1.0.0` | Versión del paquete npm. No debe asumirse que determina por sí sola la versión Android publicada. |
| Expo | `~57.0.9` | Rango declarado en `package.json`. |
| React Native | `0.86.2` | Versión declarada en `package.json`. |
| Fuente de versión de EAS | `remote` | `eas.json` establece `appVersionSource: "remote"`; revisar la versión remota de EAS antes de una build. |
| Perfiles de EAS | `development`, `preview`, `production` | Son los perfiles presentes en `eas.json` consultado. |
| Perfil `production-apk` | No aparece | No utilizar este nombre de perfil hasta que exista en la configuración de la rama que se va a compilar. |
| Runtime OTA y canal | No confirmados por los archivos consultados | No inferir un runtime, canal ni política de comprobación a partir de documentos históricos. Verificar la configuración efectiva antes de publicar una OTA. |

Estos valores describen los archivos leídos en `main` durante esta revisión. No se ejecutó Expo Config, EAS Build ni una consulta de versión remota, por lo que no constituyen una validación de la configuración efectiva de publicación.

## Diferencia entre APK y actualización OTA

Una APK es un instalador Android que contiene el runtime nativo y el paquete de aplicación generado por una build. Se utiliza cuando se necesita distribuir una compilación nueva, incluidos cambios nativos o dependencias que requieren recompilación.

Una actualización OTA distribuye cambios JavaScript/TypeScript compatibles con el runtime instalado. No reemplaza el código nativo de la aplicación. Solo debe publicarse después de verificar la compatibilidad entre el bundle, el runtime y el canal objetivo.

No publicar una OTA para cambios que requieran modificar código Kotlin/Java, dependencias nativas, plugins, configuración nativa o Expo SDK. En esos casos, evaluar y generar una nueva build de Android.

## Preparación de una build de Android

Antes de generar una build:

1. Confirmar rama, commit y estado limpio de Git.
2. Revisar `app.json`, `package.json`, `eas.json` y la configuración dinámica si existe.
3. Consultar la versión remota de EAS, ya que `appVersionSource` está configurado como `remote`.
4. Confirmar qué perfil existe realmente y qué tipo de artefacto produce.
5. Verificar la versión, el runtime efectivo y los ajustes nativos.
6. Generar la build y comprobar el artefacto resultante.
7. Instalar y probar el artefacto en un dispositivo compatible.
8. Confirmar por separado si el archivo se subió a la GitHub Release correspondiente.

No asumir que el perfil llamado `production` genera una APK. El tipo de artefacto debe verificarse en la configuración efectiva del perfil y en el resultado de EAS Build.

## Preparación de una actualización OTA

Antes de publicar una OTA:

- [ ] Confirmar `git status` y `git rev-parse HEAD`.
- [ ] Revisar el diff completo.
- [ ] Confirmar que no cambiaron AndroidManifest, plugins, dependencias nativas, Expo SDK, runtime, código Kotlin ni código Java.
- [ ] Resolver la configuración efectiva de runtime y canal para Android.
- [ ] Confirmar que el canal destino existe y corresponde a la distribución instalada.
- [ ] Publicar solo cambios compatibles con el runtime.
- [ ] Registrar Update Group ID, commit publicado, runtime y canal.
- [ ] Verificar la actualización en un dispositivo con la build objetivo.

Si no puede determinarse con certeza el runtime o canal efectivos, detener la publicación hasta resolverlo.

## Comando de publicación OTA

Usar este comando únicamente después de completar las comprobaciones anteriores y confirmar que el proyecto tiene la configuración OTA requerida:

```bash
eas update \
  --channel production \
  --platform android \
  --message "descripción del cambio"
```

El comando se dirige al canal `production`; su presencia en la guía no demuestra que ese canal esté configurado o enlazado correctamente en el commit actual.

## Registro posterior a la publicación

Registrar como mínimo:

- Commit exacto publicado.
- Rama y estado de Git antes de publicar.
- Versión de la aplicación y fuente de versión utilizada.
- Runtime efectivo y canal OTA, si corresponde.
- Update Group ID para una OTA o enlace/artefacto para una build.
- Resultado de la instalación y de las comprobaciones en dispositivo.

La creación de una build o una OTA no demuestra por sí sola que el usuario final la haya recibido o instalado.
