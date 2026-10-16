# Versiones, actualizaciones y distribución Android

Esta guía explica cómo se distribuye CardioSync para Android, qué diferencia hay entre una APK y una actualización OTA y qué configuración debe revisarse antes de publicar una versión.

## Versiones y perfiles de compilación

La configuración de Expo y EAS se define principalmente en:

- `app.json`
- `app.config.js`
- `package.json`
- `eas.json`

En la referencia documental de `feature/app-updates`, la versión declarada en `app.json` y `package.json` es `1.2.0`, con Expo `~57.0.26` y React Native `0.86.3`. Los metadatos de versión visibles dentro de la app de esa referencia declaran `1.1.0` y React Native `0.86.2`; por eso, antes de una publicación debe confirmarse cuál es la versión que corresponde mostrar al usuario y actualizar las fuentes de forma coherente.

Los perfiles de EAS incluyen `development`, `preview`, `production` y `production-apk`. El perfil `production-apk` está configurado para generar una APK instalable. La configuración activa de rutas, runtime y canal depende del perfil y de la configuración efectiva de Expo.

## APK de producción

Una APK es un paquete instalable de Android. Se utiliza para distribuir una nueva versión que incluya los cambios nativos y JavaScript/TypeScript que se compilaron en esa build.

Antes de generar una APK, revisar rama, commit, estado de Git, versión y runtime efectivo. Después de compilar, verificar el artefacto y probar instalación y apertura en un dispositivo compatible. La existencia de una build no significa que el archivo se haya subido a GitHub Releases.

## Actualizaciones OTA

Las actualizaciones OTA entregan cambios compatibles de JavaScript/TypeScript sin sustituir el runtime nativo instalado. Son apropiadas para cambios de pantallas, navegación, componentes, textos, estilos y lógica JavaScript/TypeScript cuando no requieren modificaciones nativas.

No se debe publicar una OTA para cambios que afecten dependencias nativas, plugins o configuración nativa, Expo SDK, runtime o código Kotlin/Java. En esos casos corresponde evaluar y generar una nueva build.

La configuración de la rama de referencia establece `updates.checkAutomatically: 'NEVER'`; el comportamiento de comprobación debe coordinarse con el flujo de actualización de la aplicación. No asumir que el cliente descargará o instalará automáticamente una OTA sin revisar la implementación y la configuración efectivas.

Comando de publicación OTA para Android, únicamente después de completar las comprobaciones previas:

```bash
eas update \
  --channel production \
  --platform android \
  --message "descripción del cambio"
```

## Comprobaciones antes de publicar

### Para cualquier publicación

- [ ] Confirmar la rama y el commit exactos.
- [ ] Confirmar que el estado de Git es limpio.
- [ ] Verificar versión de la aplicación y metadatos visibles.
- [ ] Verificar Expo SDK, dependencias y configuración efectiva.
- [ ] Registrar qué artefacto o actualización se publicó.

### Antes de una OTA

- [ ] Revisar el diff completo.
- [ ] Confirmar que no hay cambios nativos ni de configuración incompatible.
- [ ] Verificar runtime y canal efectivos para Android.
- [ ] Publicar solo cambios compatibles con el runtime instalado.
- [ ] Registrar el Update Group ID, el commit publicado, runtime y canal.

### Antes de una APK

- [ ] Confirmar versión, runtime y perfil `production-apk`.
- [ ] Generar la APK de producción.
- [ ] Instalar y probar el artefacto.
- [ ] Verificar el archivo subido a la release correspondiente.

## Fuentes de configuración

- `app.json`: versión y configuración Expo.
- `app.config.js`: configuración dinámica, plugins y opciones efectivas.
- `package.json`: versiones de dependencias.
- `eas.json`: perfiles de build y opciones de distribución.
- `src/features/appUpdate` y `src/features/updates`: funcionalidades de actualización en la app.

Los valores de configuración pueden cambiar entre ramas y commits. Antes de utilizar esta guía para una publicación real, tomar los valores de la revisión exacta que se va a distribuir.