# Flujo de desarrollo y validación

| Campo | Valor |
|---|---|
| Tipo | Procedimiento operativo para desarrollo |
| Plataforma de referencia | GitHub Codespaces / Linux |
| SDK de referencia | Expo SDK 57 |
| Estado | Guía de trabajo; los comandos deben ejecutarse y sus resultados registrarse por tarea |
| Última revisión | 2026-10-15 |

## 1. Objetivo y alcance

Este documento define un flujo conservador para modificar, comprobar y documentar CardioSync. Su prioridad es preservar la estabilidad de la aplicación y hacer que cada cambio pueda revisarse y reproducirse.

Esta guía no certifica que el repositorio actual pase todas las comprobaciones. Los comandos son pasos propuestos que deben ejecutarse en el entorno de trabajo y evaluarse según su resultado.

## 2. Principios obligatorios

- Mantener TypeScript en modo estricto y resolver errores de compilación antes de sumar funcionalidades.
- Respetar la organización arquitectónica existente: `src/core`, `src/domain`, `src/features` y `src/components`. Otros directorios presentes en el repositorio no deben reorganizarse automáticamente.
- Antes de añadir una dependencia, evaluar si la funcionalidad puede resolverse con las herramientas existentes, su compatibilidad con Expo SDK 57, el impacto nativo y el costo de mantenimiento.
- No confundir código presente con comportamiento validado en un dispositivo.
- Separar cambios de documentación, cambios funcionales y cambios nativos cuando sea razonable.
- No publicar una OTA ni generar una versión de producción como efecto automático de una modificación.
- No modificar ramas principales, etiquetas de versiones ni historial remoto sin una revisión explícita del alcance y de los puntos de recuperación.

## 3. Antes de modificar archivos

Desde la raíz del repositorio:

```bash
cd /workspaces/CardioSync

echo "===== RAMA ====="
git branch --show-current

echo "===== COMMIT ====="
git rev-parse HEAD

echo "===== ESTADO GIT ====="
git status

echo "===== VERSIONES Y SCRIPTS ====="
node --version
npm --version
node -p "require('./package.json').version"
node -p "require('./package.json').dependencies.expo"
node -p "require('./package.json').scripts"
```

Si existen cambios locales, identificarlos antes de continuar. No descartarlos ni sobrescribirlos para dejar el árbol limpio sin confirmar primero su origen.

## 4. Implementación y validación local

Después de un cambio funcional, ejecutar las comprobaciones que correspondan al alcance:

```bash
cd /workspaces/CardioSync

echo "===== TYPESCRIPT ====="
npm run typecheck

echo "===== FORMATO ====="
npm run format:check

echo "===== ESPACIOS Y CONFLICTOS DEL DIFF ====="
git diff --check

echo "===== RESUMEN DE CAMBIOS ====="
git status --short
git diff --stat
```

Interpretación:

- Si falla TypeScript, resolver los errores relacionados antes de agregar otra funcionalidad.
- Si falla el chequeo de formato, revisar el resultado y aplicar cambios de formato de forma controlada. No ejecutar un formateo masivo del repositorio como efecto secundario de una tarea pequeña.
- Si `git diff --check` detecta errores, corregirlos antes de preparar el commit.
- Un resultado exitoso de estos comandos no sustituye las pruebas funcionales, de integración, de dispositivo o de compilación nativa que requiera el cambio.

Si las dependencias no están instaladas o el entorno no está preparado, registrar esa condición. No modificar archivos de bloqueo ni actualizar dependencias solo para intentar silenciar un error sin investigar primero su causa.

## 5. Prueba en Development Build

Para iniciar Metro a través de un túnel en Codespaces, utilizar:

```bash
npx expo start --dev-client --tunnel
```

La aplicación debe probarse en una Development Build compatible con el código nativo del proyecto. Expo Go no debe asumirse como sustituto cuando una funcionalidad depende de módulos nativos.

La prueba debe registrar como mínimo:

- dispositivo y versión de Android;
- versión de CardioSync instalada;
- escenario y pasos ejecutados;
- resultado esperado y resultado observado;
- errores visibles o logs relevantes;
- si la prueba se realizó en desarrollo, preview o producción.

No declarar una funcionalidad como verificada si únicamente se comprobó que compila o que existe el archivo de implementación.

## 6. Criterios para cambios nativos y OTA

Antes de publicar una OTA, seguir el procedimiento completo de [Versiones, actualizaciones y distribución Android](14_RELEASES_AND_UPDATES.md).

Como regla de seguridad, una OTA solo debe considerarse cuando el cambio es compatible con el runtime nativo instalado. Cambios en Expo SDK, dependencias nativas, plugins, configuración nativa, código Kotlin/Java o runtime requieren evaluar una nueva build.

No usar una OTA para ocultar una discrepancia de configuración o una compilación que no se ha validado. Si hay dudas sobre el impacto nativo, detener la publicación y revisar el caso antes de decidir.

## 7. Documentación que acompaña un cambio

Actualizar solo los documentos afectados por el cambio:

| Tipo de cambio | Documentación que debe revisarse |
|---|---|
| Nueva funcionalidad visible | Guía de uso y descripción funcional |
| Cambio de arquitectura o dependencias | Arquitectura, módulos, estructura y decisiones |
| Cambio de esquema, importación o persistencia | Base de datos e importación |
| Cambio en backups o recuperación | Copias de seguridad y recuperación |
| Cambio en Health Connect | Integración Health Connect y permisos afectados |
| Cambio de OTA, APK o perfiles EAS | Versiones, actualizaciones y distribución |
| Cambio significativo validado | Changelog y, cuando corresponda, roadmap |

No registrar como completado un comportamiento que solo está implementado. Diferenciar siempre: **implementado**, **validado técnicamente**, **probado en dispositivo** y **publicado**.

## 8. Cierre y checkpoint

Antes de cerrar una tarea:

1. Revisar el diff completo.
2. Confirmar que no se incluyeron archivos temporales, datos personales, bases SQLite, secretos ni artefactos de build.
3. Ejecutar las comprobaciones adecuadas al alcance.
4. Actualizar la documentación afectada.
5. Crear un commit con un mensaje que describa el cambio.
6. Verificar el commit y el estado de Git.
7. Confirmar que el commit esperado llegó a GitHub antes de declarar la tarea sincronizada.

Comandos de comprobación después del commit:

```bash
echo "===== COMMIT FINAL ====="
git rev-parse HEAD
git log -1 --oneline

echo "===== ESTADO FINAL ====="
git status

echo "===== SINCRONIZACION CON REMOTO ====="
git status -sb
```

Un árbol limpio no demuestra por sí solo que el commit se haya subido a GitHub. Confirmar la rama remota y su SHA antes de cerrar el checkpoint.

## 9. Advertencia sobre la estructura de ramas

La documentación de este procedimiento no decide qué rama debe considerarse la fuente definitiva de producción. Antes de integrar documentación o código en `main`, verificar la relación entre el historial de ramas, las etiquetas de releases y los commits usados para generar APK. No realizar fusiones de historias sin ancestro común ni reemplazos de ramas como parte de una tarea rutinaria.

## 10. Referencias relacionadas

- [Arquitectura](01_ARCHITECTURE.md)
- [Estructura de carpetas](12_FOLDER_STRUCTURE.md)
- [Decisiones arquitectónicas](03_DECISIONS.md)
- [Normas de documentación](99_DOCUMENTATION_GUIDELINES.md)
- [Versiones, actualizaciones y distribución Android](14_RELEASES_AND_UPDATES.md)
- [Auditoría documental inicial](00_DOCUMENTATION_AUDIT_2026-10-15.md)


## 11. Flujo de documentación mediante Pull Requests

Para actualizar la documentación principal:

1. Inspeccionar el documento y contrastar sus afirmaciones con la rama objetivo.
2. Si el documento es correcto, no modificar su contenido sin necesidad; si no existe en la rama, proponer su incorporación como un cambio documental separado.
3. Cuando haya cambios, modificar un solo documento por Pull Request.
4. Releer el archivo desde GitHub después del commit y describir qué se verificó y qué pruebas no se ejecutaron.
5. No fusionar el PR sin revisión y autorización del responsable del proyecto.
6. No recrear documentos que hayan sido eliminados deliberadamente.
