# CardioSync — Contexto Maestro del Proyecto

| Campo | Valor |
|---|---|
| Documento | `00_PROJECT_MASTER_CONTEXT.md` |
| Tipo | Documento maestro del proyecto |
| Estado | Activo |
| Última revisión | 2026-10-17 |
| Fuente de verdad de implementación | Código de la rama revisada y configuración del proyecto |

Este documento es el punto de entrada para comprender CardioSync, sus límites arquitectónicos, el estado conocido de sus módulos y la documentación complementaria.

> **Regla de autoridad:** el código y la configuración vigentes describen lo implementado; las especificaciones describen las reglas de diseño; el roadmap describe trabajo pendiente. Una función mencionada en documentación no debe considerarse validada en dispositivos sin evidencia de pruebas.

---

## 1. Propósito y visión

CardioSync es una aplicación Android para el seguimiento personal de la presión arterial y otra información cardiovascular compatible. Permite registrar mediciones, consultar historial y estadísticas, generar reportes y utilizar integraciones de salud y mecanismos de respaldo disponibles en el proyecto.

La aplicación no sustituye la evaluación de profesionales de la salud ni debe presentarse como herramienta autónoma de diagnóstico.

Los objetivos técnicos son:

- Mantener una arquitectura modular, clara y mantenible.
- Separar presentación, dominio, infraestructura y reglas clínicas.
- Preservar la integridad de los datos de salud.
- Mantener TypeScript en modo estricto.
- Verificar compatibilidad con Expo SDK 57 antes de proponer cambios.
- Evitar dependencias nuevas sin justificar necesidad, compatibilidad y costo de mantenimiento.
- Mantener código, pruebas y documentación sincronizados.
- Diferenciar funcionalidades implementadas de funcionalidades cuya operación todavía necesita validación.

## 2. Stack tecnológico

El proyecto utiliza las dependencias declaradas en `package.json`. Entre las principales:

| Área | Tecnología |
|---|---|
| Lenguaje | TypeScript |
| Aplicación | React Native |
| Plataforma | Expo SDK 57 |
| Navegación | Expo Router |
| Persistencia local | Expo SQLite |
| Formularios | React Hook Form |
| Validación | Zod |
| Estado compartido | Zustand |
| Gráficos y visualización | React Native Skia, SVG y bibliotecas de gráficos declaradas |
| Actualizaciones JavaScript | Expo Updates |
| Integraciones Android | Health Connect y módulos nativos declarados por el proyecto |

Las versiones exactas y la compatibilidad se deben comprobar en `package.json`, `package-lock.json`, `app.json` y `app.config.js`. No se debe asumir compatibilidad por el nombre de una biblioteca o por documentación de otra versión de Expo.

## 3. Arquitectura y estructura

La estructura modular principal del código es:

- `src/core`: infraestructura y capacidades compartidas.
- `src/domain`: modelos, reglas y conceptos del dominio.
- `src/features`: funcionalidades organizadas por área.
- `src/components`: componentes de presentación reutilizables.

Las rutas de la aplicación se organizan mediante Expo Router. La configuración del proyecto contempla los árboles `app` y `app-production`; la raíz de rutas efectiva depende de la configuración de ejecución/build. La separación debe conservarse al cambiar navegación o herramientas de desarrollo.

### Límites de responsabilidad

- **Presentación:** muestra información y recoge acciones del usuario; no debe contener reglas de negocio ni acceder directamente a SQLite.
- **Dominio:** modela conceptos y reglas de negocio sin depender de componentes React.
- **Persistencia:** las operaciones de base de datos deben pasar por los repositorios o servicios de persistencia definidos por el proyecto.
- **Estadísticas:** calcula métricas descriptivas; no debe generar interpretaciones clínicas.
- **Dominio clínico:** concentra clasificación, reglas, contexto y resultados clínicos trazables.
- **Servicios de integración:** encapsulan el acceso a sistemas externos y capacidades nativas.

Toda modificación arquitectónica debe respetar la estructura existente y registrar decisiones cuando cambie una regla o un límite relevante.

## 4. Funcionalidades y estado conocido

Los siguientes estados reflejan la inspección documental y de código disponible. **“Implementación presente” no equivale a validación integral en todos los dispositivos.**

| Área | Estado conocido | Observaciones |
|---|---|---|
| Mediciones de presión arterial | Implementación presente | Incluye operaciones de registro e historial descritas en la documentación del módulo. |
| Estadísticas y visualizaciones | Implementación presente | Mantener los cálculos descriptivos separados de las reglas clínicas. |
| Clasificación y análisis clínico | Implementación presente | La corrección clínica debe evaluarse contra la fuente clínica activa y sus pruebas. |
| Reportes | Implementación presente | Existen servicios para construir y compartir reportes; validar los flujos reales cuando cambien. |
| SQLite | Implementación presente | La base de datos principal se identifica como `cardiosync.db` en el servicio inspeccionado. |
| Health Connect | Servicios presentes | Los datos disponibles dependen de permisos, fuentes y compatibilidad del dispositivo. |
| Backup manual | Servicio presente | Se identificó un flujo que copia la base de datos mediante el selector de ubicación de Android. |
| Google Drive | Servicio presente | La integración requiere autenticación y autorización. |
| Backup programado | Servicio presente | Su ejecución depende de la configuración y de los mecanismos y restricciones del sistema Android. |
| Actualizaciones OTA | Servicios y pantalla presentes | La comprobación, descarga y aplicación son pasos distintos y deben verificarse por separado. |
| Actualización por APK | Servicios y pantalla presentes | La descarga valida datos del paquete antes de solicitar al instalador Android; la instalación requiere intervención del sistema/usuario. |

Cuando una tarea dependa de una función sensible —en particular restauración de copias, datos de salud, actualización o migración de base de datos— debe revisarse el flujo completo y sus errores posibles antes de declarar que está validada.

## 5. Dominio clínico y evidencia

La referencia clínica activa del proyecto es el **Consenso Argentino de Hipertensión Arterial 2025**, según el alcance documental vigente.

Las reglas clínicas deben:

- Identificar la fuente que las respalda.
- Mantener trazabilidad entre fuente, criterio, regla implementada y resultado mostrado.
- Separarse de las estadísticas descriptivas y de la interfaz.
- Distinguir datos faltantes de resultados negativos.
- Evitar recomendaciones que no puedan vincularse con una fuente clínica documentada.
- Mantener sus limitaciones visibles para el usuario.

La existencia de un motor clínico no demuestra por sí sola que todas las reglas de una guía estén implementadas ni que el producto haya sido validado clínicamente.

## 6. Persistencia, copias y privacidad

La base de datos principal utiliza SQLite en el almacenamiento de la aplicación. Los flujos de respaldo y las integraciones externas son distintos del almacenamiento local:

- Las operaciones de Health Connect dependen de los permisos concedidos por el usuario.
- Google Drive requiere configuración, autenticación y autorización.
- El backup manual utiliza una ubicación elegida mediante Android.
- Las tareas programadas dependen de la configuración y de las restricciones del sistema operativo.
- Las actualizaciones consultan los servicios de publicación configurados y pueden descargar archivos desde GitHub Releases.

No se debe afirmar que todos los datos permanecen exclusivamente en el dispositivo cuando se utilizan integraciones externas. Los documentos específicos deben explicar qué datos se leen, escriben, exportan o transfieren, y qué autorización requiere cada operación.

Las tareas de restauración deben contemplar integridad, compatibilidad de esquema, errores de lectura/escritura y protección contra sobrescrituras accidentales.

## 7. Actualizaciones y distribución Android

El proyecto contempla actualizaciones OTA mediante Expo Updates y actualizaciones de la aplicación mediante APK publicada.

### OTA

OTA solo debe utilizarse para cambios compatibles con el runtime instalado, como cambios de interfaz, navegación y lógica JavaScript/TypeScript. No es apropiada para cambios de Expo SDK, dependencias nativas, plugins, manifiesto Android, código Kotlin/Java u otros cambios que alteren el runtime nativo.

Antes de cada publicación OTA se debe verificar el estado de Git, el commit, la configuración efectiva de runtime y channel, y confirmar que no hubo cambios nativos incompatibles. Si existe duda sobre la compatibilidad, detener la publicación OTA y preparar una nueva APK de producción.

### APK de producción

El perfil preferido de distribución es `production-apk`. Antes de compilar se deben revisar el estado de Git, el commit, la versión, la configuración efectiva de Expo y los cambios nativos. La salida esperada para una publicación de producción es APK, no AAB, salvo solicitud explícita.

La configuración efectiva debe comprobarse desde `app.config.js` y `app.json`; no se deben copiar valores de runtime o channel de documentación antigua sin verificarlos en la configuración vigente.

## 8. Calidad y definición de terminado

Una modificación no se considera terminada solo porque el código fue escrito. Según el alcance, la validación puede incluir:

- TypeScript: `npm run typecheck`.
- Formato: `npm run format:check`, cuando corresponda.
- Pruebas automatizadas disponibles.
- Revisión de compatibilidad con Expo SDK 57.
- Revisión de errores, estados vacíos, permisos y recuperación.
- Verificación manual en Development Build o dispositivo para los flujos nativos afectados.
- Actualización de la documentación relacionada.
- Revisión del diff para confirmar que solo cambió el alcance previsto.

Si una comprobación no se ejecutó, debe declararse explícitamente; no se debe presentar como aprobada.

## 9. Política de cambios y dependencias

- Auditar primero el código y la documentación relacionados.
- Resolver errores de compilación o tipado antes de agregar funcionalidades.
- Mantener TypeScript strict.
- No agregar dependencias sin evaluar necesidad, mantenimiento, tamaño, compatibilidad y efectos nativos.
- Preferir APIs oficiales de Expo cuando cubran adecuadamente la necesidad.
- Evitar accesos directos a SQLite desde la UI.
- No mezclar una publicación OTA con cambios que requieren una nueva compilación nativa.
- Mantener los cambios pequeños, revisables y trazables mediante commits y Pull Requests.

## 10. Documentación oficial

La carpeta `docs/` contiene la documentación técnica, clínica y operativa del proyecto. Los documentos principales son:

1. `00_PROJECT_MASTER_CONTEXT.md`: contexto maestro y punto de entrada.
2. `00_CARDIOSYNC_CONSTITUTION.md`: principios rectores del proyecto; actualmente requiere contenido.
3. `01_ARCHITECTURE.md`: arquitectura y límites entre módulos.
4. `02_ROADMAP.md`: fases completadas, en curso y planificadas.
5. `03_DECISIONS.md`: decisiones arquitectónicas y su justificación.
6. `04_CLINICAL_DOMAIN.md` y `05_CLINICAL_RULE_ENGINE.md`: dominio y reglas clínicas.
7. `06_CLINICAL_ANALYSIS.md`: análisis clínico.
8. `07_REPORTS.md`: reportes.
9. `08_HEALTH_CONNECT.md`: integración Health Connect.
10. `09_DATABASE.md`: persistencia.
11. `10_CHANGELOG.md`: historial de cambios.
12. `11_MODULES.md`: inventario de módulos.

Los documentos deben indicar si describen el estado implementado, una decisión, una propuesta o una referencia histórica. Las afirmaciones sobre el estado actual deben contrastarse con el código.

## 11. Sincronización y checkpoints

Cuando se complete una funcionalidad relevante:

1. Revisar y actualizar este documento y los documentos específicos afectados.
2. Actualizar el roadmap y changelog cuando corresponda.
3. Ejecutar las comprobaciones aplicables y registrar las que no pudieron ejecutarse.
4. Revisar el diff y crear un commit descriptivo.
5. Abrir un Pull Request para revisión.
6. Después de la fusión, verificar el commit resultante y el estado del repositorio.

No se debe declarar una sincronización con GitHub o un estado limpio de Git sin haberlo comprobado.

## 12. Referencias de desarrollo

Desde la raíz del repositorio:

```bash
npx expo start --dev-client --tunnel
```

Comprobación de TypeScript:

```bash
npm run typecheck
```

Las tareas de desarrollo, validación y distribución deben ejecutarse con la versión de Node/npm y las dependencias fijadas por el repositorio.

## 13. Principio rector

CardioSync debe evolucionar de forma incremental, con prioridad en la estabilidad, la mantenibilidad, la integridad de la información de salud y la trazabilidad clínica. El código, la configuración, las pruebas y la documentación deben permanecer coherentes; cuando no se conozca el estado real de una función, se debe declarar la incertidumbre y auditar antes de afirmar que está terminada.
