# Versiones, actualizaciones y distribución Android

| Campo | Valor |
|---|---|
| Tipo | Procedimiento operativo de publicación |
| Plataforma | Android |
| Fuente operativa principal | Este documento |
| Última actualización | 2026-10-17 |

Esta guía establece el procedimiento para preparar, validar y publicar versiones de CardioSync. Antes de cada publicación se deben verificar los archivos y la configuración efectiva del commit que se distribuirá. La documentación no sustituye esa verificación.

## 1. Versionado y runtime Android

### Política oficial

CardioSync para Android utiliza **una única política de runtime: `appVersion`**.

El runtime efectivo de una build Android debe corresponder a la versión de la aplicación. Por ejemplo, una APK `1.2.0` utiliza runtime `1.2.0`. El valor efectivo se debe confirmar con Expo/EAS antes de publicar.

Reglas obligatorias:

- No configurar una política `fingerprint` paralela para Android.
- Mantener la política Android en `appVersion`, heredada de la configuración global de Expo cuando no exista una sobrescritura específica para Android.
- Verificar `app.config.js`, `app.json` y la configuración pública resuelta antes de cada build y OTA.
- No inferir el runtime instalado a partir de `package.json`: verificar los datos de la build EAS.
- Publicar OTA solamente para el runtime compatible con la APK de destino.
- Cuando se cambie la versión de la aplicación, el nuevo runtime esperado también cambiará. Para distribuir ese runtime se debe generar y publicar la nueva APK antes de enviar OTA dirigidas a él.
- No cambiar ni eliminar la configuración de iOS como parte de una tarea exclusiva de Android. CardioSync se distribuye actualmente para Android.

La configuración `updates.checkAutomatically: 'NEVER'` debe verificarse por separado: publicar una OTA no implica que la aplicación la descargue automáticamente.

### Fuentes de configuración

- `package.json`: versión del paquete y dependencias declaradas.
- `app.json`: configuración estática de Expo.
- `app.config.js`: configuración dinámica, política de runtime y Expo Updates.
- `eas.json`: perfiles de build y canales.
- EAS Build: versión, runtime y artefacto realmente generados.
- EAS Update: runtime, canal, commit y grupo de actualización publicados.

La configuración efectiva de Expo y los datos remotos de EAS son la referencia para una publicación concreta. No reutilizar valores históricos sin verificarlos.

## 2. Pantalla Acerca de: requisito obligatorio por APK

**Cada nueva versión de APK de producción debe incluir una revisión y actualización de la pantalla Acerca de antes de generar la build.**

Archivos de información identificados en el proyecto:

- `src/features/about/config/version-info.ts`
- `src/features/about/config/appInfo.ts`

Antes de cada APK:

- [ ] Actualizar la versión que se muestra al usuario.
- [ ] Actualizar la fecha de lanzamiento correspondiente a esa distribución.
- [ ] Verificar Expo SDK, React Native, plataforma y datos técnicos contra la configuración real del proyecto.
- [ ] Actualizar las novedades para resumir los cambios relevantes desde la APK anterior.
- [ ] Incluir mejoras relevantes de código y OTA publicadas desde la última APK, sin atribuir funciones que no estén implementadas o verificadas.
- [ ] Mantener sincronizados ambos archivos de información.
- [ ] Revisar visualmente Acerca de en una build de prueba o dispositivo antes de cerrar la publicación.
- [ ] Confirmar que las notas de GitHub Release y la pantalla Acerca de describen coherentemente la versión publicada.

Las novedades deben ser útiles para el usuario, no una lista indiscriminada de commits técnicos. Los cambios internos de runtime pueden documentarse técnicamente sin presentarlos como funcionalidades visibles.

Si se publica una OTA que modifica funcionalidades visibles, revisar también si corresponde actualizar las novedades de Acerca de. Una OTA no elimina la obligación de revisar esta pantalla al preparar la siguiente APK.

## 3. Diferencia entre APK y OTA

Una APK es un instalador Android que incluye el runtime nativo y el paquete generado por EAS Build. Se utiliza para distribuir una nueva compilación.

Una OTA distribuye código JavaScript/TypeScript y recursos compatibles con el runtime de la aplicación instalada. No sustituye el código nativo.

Una OTA puede ser apropiada para cambios compatibles de interfaz, navegación, textos, reportes, estadísticas y lógica TypeScript. No debe utilizarse para cambios que requieran modificar código Kotlin/Java, AndroidManifest, plugins, dependencias nativas, Expo SDK u otros elementos incompatibles con el runtime instalado.

Ante una duda sobre compatibilidad, detener la publicación OTA y evaluar una nueva APK.

## 4. Preparación de una APK de producción

Antes de iniciar la build:

1. Confirmar rama, `git status` y `git rev-parse HEAD`.
2. Revisar los cambios y ejecutar `git diff --check`.
3. Resolver errores de compilación y ejecutar `npm run typecheck`.
4. Confirmar la versión en `package.json` y la configuración de versión remota de EAS.
5. Verificar la configuración efectiva de Expo, runtime Android y canal.
6. Revisar cambios en AndroidManifest, plugins, dependencias nativas, Expo SDK y código Kotlin/Java.
7. Actualizar y validar la pantalla Acerca de siguiendo la sección 2.
8. Actualizar la documentación relacionada y las notas de versión.
9. Crear el checkpoint y sincronizar el commit con GitHub.
10. Generar una APK con el perfil `production-apk`, salvo que el usuario solicite expresamente otro formato.
11. Verificar en EAS la versión, runtime, version code y enlace del artefacto.
12. Instalar y probar la APK antes de dar por validada la distribución.
13. Actualizar el APK de la GitHub Release correspondiente y sus notas.
14. Verificar que GitHub contiene el artefacto nuevo y las notas correctas.

No asumir que un perfil llamado `production` produce APK. Verificar que el perfil elegido configura `android.buildType: apk` y confirmar el artefacto de salida.

## 5. Preparación de una OTA de producción

Antes de publicar:

- [ ] Confirmar `git status` y `git rev-parse HEAD`.
- [ ] Revisar el diff completo.
- [ ] Ejecutar `npm run typecheck`.
- [ ] Confirmar que no hay cambios nativos incompatibles.
- [ ] Resolver la configuración efectiva del runtime Android y del canal.
- [ ] Confirmar que el runtime coincide con el de la APK objetivo.
- [ ] Confirmar el canal `production`.
- [ ] Publicar solo cambios compatibles.
- [ ] Registrar Update Group ID, commit, runtime, canal y mensaje.
- [ ] Verificar el resultado en un dispositivo con la APK objetivo.
- [ ] No asumir que la OTA se instaló solo porque EAS confirmó su publicación.

Comando de publicación, únicamente después de las verificaciones:

```bash
eas update \
  --channel production \
  --platform android \
  --environment production \
  --message "descripción del cambio"
```

## 6. Registro posterior

Para una APK, registrar:

- Versión y version code.
- Commit de la build.
- Runtime Android.
- Build ID y enlace de descarga.
- Etiqueta y enlace de GitHub Release.
- Resultado de las pruebas de instalación.
- Confirmación de que Acerca de y las notas de Release están actualizadas.

Para una OTA, registrar:

- Commit publicado.
- Runtime y canal.
- Update Group ID y Android update ID.
- Mensaje de publicación.
- Resultado de la verificación en dispositivo.

La publicación de una build u OTA no demuestra por sí sola que el usuario final la haya recibido o instalado.
