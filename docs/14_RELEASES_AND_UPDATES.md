# Versiones, actualizaciones y distribución Android

Esta guía describe cómo comprobar y distribuir una versión de CardioSync para Android. Los valores de configuración deben verificarse en la rama y el commit exactos que se van a publicar; este documento no sustituye esa comprobación.

## Fuentes de configuración

La configuración consultada en la rama `main` como referencia histórica; los valores de la rama de trabajo se verificaron el 2026-10-17 incluye:

- `app.json`: configuración estática de Expo y versión declarada.
- `package.json`: versión del paquete y versiones declaradas de dependencias.
- `eas.json`: perfiles de compilación y opciones de EAS Build.

En feature/app-updates sí existe `app.config.js`. Define `updates.url`, `checkAutomatically: 'NEVER'`, `runtimeVersion.policy: 'appVersion'` como valor general y `fingerprint` para Android e iOS; la configuración dinámica prevalece al resolver Expo Config.

## Estado observado en main — 2026-10-17

| Elemento | Valor encontrado | Alcance de la observación |
|---|---|---|
| Versión en `app.json` | Debe comprobarse en el archivo de la rama objetivo | No asumir que el valor histórico de main representa feature/app-updates. |
| Versión en `package.json` | `1.2.0` | Valor leído en feature/app-updates; no confirma por sí solo la versión remota de EAS ni la instalada. |
| Expo | `~57.0.26` | Rango declarado en package.json de feature/app-updates. |
| React Native | `0.86.3` | Versión declarada en package.json de feature/app-updates. |
| Fuente de versión de EAS | `remote` | `eas.json` establece `appVersionSource: "remote"`; revisar la versión remota de EAS antes de una build. |
| Perfiles de EAS | `development`, `preview`, `production` | Son los perfiles presentes en `eas.json` consultado. |
| Perfil `production-apk` | Presente en `eas.json` | Configurado con `android.buildType: apk` y canal `production` en feature/app-updates. Verificar la configuración en el commit de publicación. |
| Runtime Android | Política `fingerprint` en `app.config.js` | Configuración declarada en feature/app-updates; confirmar con Expo Config antes de publicar. |

Los valores anteriores se deben interpretar según la rama nombrada en cada fila. La configuración de feature/app-updates se inspeccionó en sus archivos; no se ejecutó `npx expo config` ni se consultó la versión remota de EAS. No se ejecutó Expo Config, EAS Build ni una consulta de versión remota, por lo que no constituyen una validación de la configuración efectiva de publicación.

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


## Nota de mantenimiento de la rama de trabajo — 2026-10-17

La configuración inspeccionada en `feature/app-updates` declara Expo `~57.0.26`, React Native `0.86.3`, el perfil `production-apk` con salida APK, canal EAS `production`, `appVersionSource: remote` y runtime Android con política `fingerprint` en `app.config.js`. Antes de publicar, comprobar la configuración efectiva del commit con Expo/EAS; el contenido del archivo por sí solo no certifica la configuración remota ni una actualización recibida por un dispositivo.
