# Versiones, actualizaciones y distribución Android

| Campo | Valor |
|---|---|
| Tipo | Referencia operativa de configuración |
| Fecha de revisión | 2026-10-15 |
| Rama de referencia | `feature/app-updates` |
| Commit de referencia | `c62b9106f7a1a720b274bb7f386111313d08403e` |
| Estado | Configuración inspeccionada; flujos operativos pendientes de prueba |

## 1. Fuentes de configuración inspeccionadas

La configuración de la rama de referencia se inspeccionó en `app.json`, `package.json`, `app.config.js` y `eas.json`. Esta sección describe esos archivos en el commit indicado; no garantiza que otra rama o un build remoto tenga exactamente la misma configuración.

- `app.json` declara la versión de aplicación `1.2.0`.
- `package.json` declara la versión `1.2.0`, Expo `~57.0.26` y React Native `0.86.3`.
- `eas.json` define los perfiles `development`, `preview`, `production` y `production-apk`.
- Los perfiles `production` y `production-apk` utilizan el canal `production` y establecen `CARDIOSYNC_ROUTER_ROOT=app-production`.
- El perfil `production-apk` declara `android.buildType=apk`.
- El perfil `development` usa el canal `development` y la raíz de rutas `app`; `preview` usa el canal `beta`.
- `app.config.js` agrega el plugin `./plugins/withCardioSyncUpdateInstaller` y configura las arquitecturas de compilación según el perfil.

## 2. Discrepancia de metadatos visibles

En el mismo commit, `src/features/about/config/version-info.ts` y `src/features/about/config/appInfo.ts` declaran la versión `1.1.0` y React Native `0.86.2`. Estos valores no coinciden con `app.json` y `package.json`.

Esta documentación registra la discrepancia, no la resuelve. Antes de cambiar esos archivos hay que decidir una única fuente de verdad y confirmar qué información se muestra en la aplicación instalada.

## 3. OTA y APK no son intercambiables

Las actualizaciones OTA solo deben utilizarse cuando el cambio sea compatible con el runtime nativo ya instalado. Los cambios en dependencias nativas, plugins/configuración nativa, Expo SDK, runtime o código nativo requieren evaluar una nueva build, no una publicación OTA.

Antes de publicar OTA, verificar el estado de Git, el commit, la configuración efectiva de runtime y canal, y que el diff no incluya cambios nativos. La configuración de runtime debe leerse de la configuración efectiva de la rama y del build, no asumirse a partir de documentación antigua.

Comando de publicación OTA — utilizar solo después de completar esas verificaciones:

```bash
eas update \
  --channel production \
  --platform android \
  --message "descripción del cambio"
```

Para una nueva versión de producción, el perfil destinado a generar APK es `production-apk`. Antes de compilar, confirmar estado de Git, commit, versión y runtime efectivo. No asumir que el archivo APK resultante se publicó en GitHub Releases hasta comprobarlo.

## 4. Checklist de verificación previa a una release

- [ ] Confirmar rama y commit exactos.
- [ ] Confirmar que el estado de Git es limpio.
- [ ] Verificar versión de `app.json`, `package.json` y metadatos visibles en la app.
- [ ] Verificar Expo SDK y React Native en la misma referencia.
- [ ] Revisar `app.config.js`, plugins y configuración nativa.
- [ ] Confirmar runtime efectivo y canal en el build objetivo.
- [ ] Para OTA, revisar el diff y descartar cambios incompatibles con el runtime.
- [ ] Para cambios nativos, generar y probar una APK de producción.
- [ ] Probar actualización, instalación y apertura en un dispositivo compatible.
- [ ] Registrar el commit, el artefacto publicado y el resultado de las pruebas.
- [ ] Verificar la release y el artefacto en GitHub antes de anunciar la publicación.

## 5. Limitaciones de esta referencia

La revisión fue estática. No se ejecutó una build ni se validó un flujo OTA en un dispositivo. No se confirma aquí el runtime efectivo de un APK publicado, el commit instalado por los usuarios ni el éxito de una release concreta. Registrar esa información con evidencia de cada publicación.
