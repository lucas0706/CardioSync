# CardioSync — Checkpoint Backup — 2026-08-27

| Campo | Valor |
|-------|-------|
| Documento | 15_CHECKPOINT_BACKUP_2026-08-27.md |
| Tipo | Checkpoint técnico |
| Fecha | 2026-08-27 |
| Estado | Infraestructura de Backup implementada; programación automática desactivada |
| Branch | feature/clinical-knowledge-base-specification |
| Commit actual | 8bf73bb |

---

# 1. Objetivo

Documentar el estado alcanzado en la implementación de la infraestructura de copias de seguridad de CardioSync hasta el 2026-08-27.

Este checkpoint diferencia claramente entre:

- funcionalidades de Backup ya implementadas y disponibles;
- infraestructura preparada para futuras funcionalidades;
- funcionalidades que todavía no están activas para el usuario.

---

# 2. Backup local manual

## Estado

✅ COMPLETADO

CardioSync dispone de un flujo funcional para realizar una copia local de la base de datos SQLite.

La copia utiliza la base de datos real de CardioSync y genera una base SQLite independiente destinada al backup.

La implementación incluye validación de integridad de la copia.

---

# 3. Validación de integridad

El proceso de backup valida la base generada mediante:

- `PRAGMA integrity_check`;
- verificación de las tablas de la base;
- verificación de los registros.

El objetivo es evitar considerar válida una copia que no pueda abrirse o que presente inconsistencias.

---

# 4. Restauración de base de datos

## Estado

✅ COMPLETADO

Se implementó infraestructura para restaurar CardioSync desde una copia de seguridad de la base SQLite.

Checkpoint relacionado:

`checkpoint-cardiosync-restore-2026-08-26`

Commit:

`6d0ccb3`

La restauración forma parte del sistema de recuperación de datos y es independiente de la futura ejecución automática de backups.

---

# 5. Configuración de copias programadas

## Estado

🚧 INFRAESTRUCTURA PREPARADA / FUNCIONALIDAD DESACTIVADA

Se implementó la pantalla de configuración de copias programadas.

Actualmente permite configurar:

- frecuencia diaria;
- frecuencia semanal;
- selección de día para la frecuencia semanal;
- hasta tres horarios diferentes por día.

Para frecuencia diaria se muestran los horarios disponibles y se pueden seleccionar hasta tres.

Para frecuencia semanal se selecciona primero el día de la semana y luego hasta tres horarios.

Checkpoint relacionado:

`checkpoint-backup-scheduling-v1`

Commit:

`4ac6cdd`

---

# 6. Estado de la interfaz

La funcionalidad de copias programadas no está actualmente disponible para el usuario.

La opción permanece visible dentro de Configuración, pero está marcada como:

`Próximamente`

El acceso a la pantalla de configuración programada está desactivado.

Esto permite conservar la infraestructura desarrollada sin presentar al usuario una funcionalidad que todavía no está terminada.

Commit:

`7375c9f`

---

# 7. Ejecución automática en segundo plano

## Estado

📋 FUTURA ACTUALIZACIÓN

Todavía NO está implementada la ejecución automática de los backups en segundo plano.

La configuración de frecuencia, día y horarios existe como infraestructura de preparación, pero actualmente no existe un scheduler operativo que garantice la ejecución automática.

La implementación futura deberá evaluar las APIs compatibles con Expo SDK 57, especialmente:

- `expo-task-manager`;
- `expo-background-fetch`.

La ejecución deberá considerarse aproximada y dependiente de las políticas de Android, no como una alarma de precisión exacta.

El usuario no requiere que la copia se ejecute exactamente en el minuto configurado.

---

# 8. Google Drive

## Estado

🚧 INFRAESTRUCTURA PREPARADA

Se sincronizó infraestructura relacionada con:

- autenticación de Google;
- servicio de Google Drive;
- configuración necesaria para integrar almacenamiento remoto.

Commit:

`e35dd39`

La integración automática completa del backup con Google Drive no debe considerarse finalizada únicamente por la existencia de estos servicios.

---

# 9. Configuración Expo

Durante la implementación de la infraestructura de Backup se produjo una modificación de la configuración de Expo.

El archivo `app.json` fue eliminado temporalmente y posteriormente restaurado desde Git.

La configuración dinámica quedó establecida mediante:

`app.config.js`

La configuración actual utiliza `app.json` como fuente base y permite definir:

`GOOGLE_SERVICES_JSON`

como origen alternativo del archivo de configuración de Google Services.

Commit de restauración:

`8bf73bb`

Se validó:

- `npx expo config --type public` → OK
- `npx tsc --noEmit` → OK

---

# 10. Limpieza del repositorio

Se eliminaron archivos temporales y backups de trabajo que habían quedado durante el desarrollo.

Se verificó que no permanecieran archivos:

- `*.bak`
- `*.bak-*`

El working tree quedó limpio.

---

# 11. Commits principales

| Commit | Descripción |
|--------|-------------|
| `7948de0` | checkpoint: backup local manual terminado |
| `6d0ccb3` | restore CardioSync database from backup |
| `4ac6cdd` | complete scheduled backup settings |
| `e35dd39` | sync backup and Google Drive infrastructure |
| `7375c9f` | mark scheduled backups as coming soon |
| `8bf73bb` | restore Expo configuration |

---

# 12. Tags relevantes

`checkpoint-backup-local-2026-08-24`

`checkpoint-backup-scheduling-v1`

`checkpoint-cardiosync-restore-2026-08-26`

---

# 13. Estado final del checkpoint

## Disponible actualmente

✅ Backup local manual

✅ Validación de integridad del backup

✅ Restauración desde backup

✅ Configuración de frecuencia diaria/semanal

✅ Selección de día semanal

✅ Hasta tres horarios configurables

## Preparado pero no activo

⏸️ Ejecución automática en segundo plano

⏸️ Integración completa del scheduler con los horarios configurados

⏸️ Backup automático hacia Google Drive

## Interfaz

La configuración de copias programadas permanece visible como:

`Próximamente`

No se ofrece al usuario como funcionalidad activa hasta completar la ejecución automática real.

---

# 14. Próximo trabajo relacionado

Cuando se retome esta funcionalidad:

1. Evaluar e instalar las dependencias necesarias para background execution compatibles con Expo SDK 57.
2. Implementar el scheduler.
3. Registrar la tarea de background.
4. Integrar el scheduler con `BackupSettingsService`.
5. Integrar la ejecución con el servicio real de Backup.
6. Implementar control de duplicados.
7. Registrar estado y errores.
8. Probar reinicios del dispositivo.
9. Probar restricciones de batería de Android.
10. Validar la integración con Google Drive.
11. Ejecutar `npx tsc --noEmit`.
12. Ejecutar las verificaciones de Expo.
13. Recién entonces habilitar la opción en Configuración.

---

# 15. Regla arquitectónica

La configuración de copias programadas y la ejecución automática son conceptos separados.

La existencia de una configuración almacenada no implica que el scheduler esté operativo.

La interfaz deberá permanecer desactivada hasta que la ejecución automática haya sido implementada, probada y validada.

