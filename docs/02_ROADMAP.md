# CardioSync — Roadmap

| Campo | Valor |
|-------|--------|
| Documento | 02_ROADMAP.md |
| Tipo | Roadmap oficial del proyecto |
| Estado | Activo |
| Última actualización | 2026-10-17 |

---

## Objetivo

Registrar la evolución de CardioSync y distinguir entre código presente, funcionalidades verificadas y trabajo pendiente. La existencia de un servicio o pantalla no implica por sí sola que todos los flujos estén validados en dispositivos reales.

## Estados

| Estado | Significado |
|--------|-------------|
| ✅ COMPLETADO | Implementación finalizada y validación disponible para el alcance indicado. |
| 🟡 IMPLEMENTADO / VALIDACIÓN PENDIENTE | Hay código funcional, pero falta confirmar uno o más escenarios o la integración completa. |
| 🚧 EN DESARROLLO | Trabajo en curso. |
| 📋 PLANIFICADO | No se considera terminado; requiere diseño o implementación adicional. |

---

# Funcionalidades base

## Arquitectura y estructura modular

**Estado:** ✅ COMPLETADO

- Estructura de navegación y módulos por funcionalidad.
- Separación entre presentación, dominio, servicios e infraestructura.
- TypeScript y configuración del proyecto alineados con Expo SDK 57.
- Documentación arquitectónica mantenida en documentos específicos.

La arquitectura seguirá evolucionando sin introducir dependencias nuevas salvo que su necesidad, compatibilidad e impacto estén evaluados.

## Mediciones e historial

**Estado:** ✅ COMPLETADO

- Registro y validación de mediciones de presión arterial.
- Persistencia local SQLite.
- Historial, detalle, edición y eliminación.
- Formulario de medición y navegación asociada.
- Resumen de la última medición en el Dashboard.

## Dashboard y estadísticas

**Estado:** ✅ COMPLETADO

- Resumen de mediciones recientes.
- Estadísticas, promedios, tendencias y filtros temporales.
- Visualización conjunta de PAS, PAD y frecuencia cardíaca.
- Interacción del gráfico mediante zoom, desplazamiento y selección de series.

## Dominio clínico

**Estado:** 🟡 IMPLEMENTADO / VALIDACIÓN CONTINUA

- Clasificación de presión arterial centralizada en el dominio.
- Contextos clínicos y objetivos terapéuticos.
- Clinical Findings, warnings y reglas clínicas.
- Clinical Rule Engine y Clinical Analysis Engine.
- Contextos contemplados: GENERAL, DIABETES, CKD y ELDERLY.
- Trazabilidad de reglas y fuentes clínicas como requisito para futuras evoluciones.

La documentación clínica debe mantenerse alineada con el Consenso Argentino de Hipertensión Arterial 2025 y con las fuentes registradas por el proyecto. No se considerará validación clínica definitiva una prueba exclusivamente técnica.

## Reportes PDF

**Estado:** 🟡 IMPLEMENTADO / VALIDACIÓN PENDIENTE

- Selección de período.
- Generación de reporte PDF.
- Gráfico de evolución para PAS, PAD y frecuencia cardíaca.
- Compartir mediante el sistema nativo.
- Limpieza del archivo temporal tras el flujo de compartir.

El reporte médico especializado y otras ampliaciones clínicas permanecen fuera del alcance completado.

## Interfaz visual V2

**Estado:** ✅ COMPLETADO

- Sistema visual reutilizable.
- Navegación principal reorganizada.
- Dashboard, historial, medición, estadísticas, perfil y configuración adaptados.
- Componentes, tarjetas, botones y acciones visuales compartidos.

---

# Configuración, integraciones y actualizaciones

## Configuración e importación/exportación

**Estado:** 🟡 IMPLEMENTADO / VALIDACIÓN PENDIENTE

- Pantallas y opciones de configuración disponibles en la navegación actual.
- Flujos de importación/exportación presentes en la aplicación.
- La documentación de base de datos todavía debe actualizarse para reflejar el alcance real y los formatos admitidos.

Pendiente: consolidar la documentación funcional, los límites de compatibilidad y los escenarios de error; no asumir compatibilidad con formatos no verificados.

## Actualización OTA

**Estado:** 🟡 IMPLEMENTADO / VALIDACIÓN CONTINUA

- Preferencia persistida para habilitar o deshabilitar la descarga automática de OTA.
- Comprobación y descarga automática condicionadas por la preferencia.
- Aplicación de la actualización mediante reinicio controlado de la aplicación.
- Pantalla de actualización con controles y estado de OTA.

La publicación OTA debe respetar el runtime compatible y la política del proyecto. Antes de publicar, verificar estado Git, commit, configuración efectiva de runtime/channel y ausencia de cambios nativos. Si cambia código nativo, plugins, dependencias nativas, Expo SDK o runtime, corresponde una nueva APK de producción y no una OTA.

## Actualización de APK desde GitHub Releases

**Estado:** 🟡 IMPLEMENTADO / VALIDACIÓN CONTINUA

- Consulta de la última versión estable en GitHub Releases.
- Identificación del APK asociado al release.
- Descarga y validaciones previas a la instalación.
- Apertura del instalador Android con intervención explícita del usuario.

La descarga no equivale a una instalación silenciosa: Android mantiene el control de confirmación. Cada publicación debe incluir la APK de producción esperada y comprobar versión, artefacto y release.

## Backup y recuperación

**Estado:** 🟡 BACKUP IMPLEMENTADO / RECUPERACIÓN PENDIENTE

### Implementado en código

- Copia SQLite con validación de integridad.
- Exportación manual de una copia a una ubicación elegida por el usuario en Android.
- Subida de copia a Google Drive, dentro de la carpeta CardioSync Backups.
- Configuración de frecuencia diaria o semanal y hora.
- Coordinación de ejecución programada, registro de estado y notificaciones.

### Pendiente

- Diseñar e implementar un flujo seguro de restauración, si no existe ya en otra parte del proyecto.
- Definir y aplicar una política de retención y limpieza de copias en la nube.
- Validar en dispositivos reales las ejecuciones programadas, restricciones del sistema y recuperación tras reinicios.
- Documentar errores, límites y procedimientos de recuperación.

No considerar el backup completado de extremo a extremo hasta validar restauración y recuperación de datos.

## Health Connect

**Estado:** 🟡 INFRAESTRUCTURA PRESENTE / INTEGRACIÓN COMPLETA PENDIENTE

- Existe un servicio de inicialización y solicitud de permisos.
- El servicio solicita permisos para tipos de registros de salud específicos.

Pendiente:

- Verificar la compatibilidad nativa con Expo SDK 57 y las builds Android de producción.
- Implementar y validar lectura/escritura efectiva de registros.
- Definir sincronización, deduplicación, errores y permisos revocados.
- Acordar cómo se muestran los datos externos y cómo se distinguen de las mediciones creadas en CardioSync.
- Actualizar la documentación de Health Connect para diferenciar el diseño previsto de lo implementado.

La presencia del servicio y de la dependencia no demuestra por sí sola que la integración de datos esté completa.

---

# Próximas fases

## 1. Consolidación documental

**Estado:** 🚧 EN DESARROLLO

- Actualizar un documento por Pull Request.
- Contrastar cada afirmación con el código y el estado conocido.
- Mantener alineados Project Master Context, Architecture, Roadmap, Changelog y documentación de módulos.
- No recrear documentos que hayan sido eliminados deliberadamente.
- Registrar de forma explícita qué fue inspeccionado y qué validaciones no se ejecutaron.

## 2. Cierre del ciclo de backup y recuperación

**Estado:** 📋 PLANIFICADO

- Diseñar restauración transaccional y segura.
- Evitar sobrescribir datos sin confirmación y validación.
- Definir política de retención de Google Drive.
- Probar copias, integridad, restauración y fallos de red/dispositivo.
- Documentar el procedimiento de recuperación para el usuario.

## 3. Completar Health Connect

**Estado:** 📋 PLANIFICADO

- Auditoría de compatibilidad nativa.
- Lectura y escritura de los registros aprobados por el producto.
- Tratamiento de permisos parciales o revocados.
- Sincronización idempotente y manejo de duplicados.
- Pruebas en dispositivos Android compatibles.

## 4. Evolución del Dashboard

**Estado:** 📋 PLANIFICADO

- Evolucionar la presentación sin duplicar reglas clínicas.
- Mantener claridad clínica, accesibilidad y bajo acoplamiento.
- Incorporar datos externos solo cuando su disponibilidad y significado estén validados.

## 5. Evolución clínica

**Estado:** 📋 PLANIFICADO

- Mantener la separación entre mediciones originales, contexto clínico y resultados derivados.
- Extender contextos solo con justificación clínica documentada.
- Trazar reglas, umbrales y hallazgos a fuentes verificables.
- Revisar las reglas frente al Consenso Argentino de Hipertensión Arterial 2025.
- Evitar presentar resultados de la aplicación como sustituto de la evaluación profesional.

## 6. Reportes clínicos ampliados

**Estado:** 📋 PLANIFICADO

- Definir el alcance del reporte médico.
- Diferenciar datos observados, estadísticas y resultados derivados.
- Incluir fuentes y contexto solo cuando estén disponibles y correctamente trazados.

## 7. Distribución y tiendas alternativas

**Estado:** 📋 PLANIFICADO

- Realizar una auditoría común de requisitos de distribución fuera de Play Store.
- Separar requisitos compartidos de los específicos de cada tienda.
- Revisar actualización, firma, privacidad, permisos y proceso de publicación por tienda.
- Evaluar cada tienda de manera individual; F-Droid queda para una etapa posterior.

---

# Criterios transversales de aceptación

Una funcionalidad no se marca como completada únicamente porque exista código. Según corresponda, debe contar con:

- Compatibilidad comprobada con Expo SDK 57 y dependencias instaladas.
- TypeScript strict y compilación sin errores.
- Pruebas automatizadas o pasos de validación reproducibles.
- Validación en dispositivo para flujos nativos, permisos, alarmas, archivos o instalación.
- Manejo de errores y estados de ausencia de datos.
- Documentación actualizada y coherente.
- Revisión del impacto sobre SQLite, migraciones, backups, actualizaciones y arquitectura.

Los cambios nativos no se publican mediante OTA. Toda publicación debe partir de un commit identificado y de un árbol de trabajo revisado.

---

# Secuencia de evolución

1. Arquitectura base.
2. Mediciones, historial y Dashboard.
3. Estadísticas y visualización clínica.
4. Dominio clínico, reglas y análisis.
5. Reportes PDF.
6. Interfaz visual V2.
7. Consolidación documental.
8. Cierre y validación de backup/recuperación.
9. Integración completa de Health Connect.
10. Evolución del Dashboard y reportes clínicos.
11. Evolución clínica trazable.
12. Auditoría de distribución en tiendas alternativas.
