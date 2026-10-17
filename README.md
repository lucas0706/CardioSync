# CardioSync

CardioSync es una aplicación Android para el seguimiento personal de la presión arterial y la información cardiovascular. Permite registrar mediciones, consultar estadísticas, integrar información de Health Connect, generar reportes y realizar copias de seguridad.

La aplicación está orientada al seguimiento personal de la salud. No sustituye una evaluación médica ni constituye una herramienta de diagnóstico.

## ¿Qué permite hacer CardioSync?

### Presión arterial

- Registrar presión arterial sistólica y diastólica.
- Asociar frecuencia cardíaca a las mediciones.
- Conservar la fecha y la hora de cada registro.
- Consultar el historial de mediciones.
- Visualizar clasificaciones y evolución de los registros.

### Estadísticas y seguimiento

Consultar estadísticas, promedios y visualizaciones para facilitar el seguimiento de la evolución de las mediciones.

### Health Connect

CardioSync integra información disponible en Android Health Connect, sujeta a los permisos concedidos y a los datos proporcionados por las fuentes conectadas.

La integración contempla datos como pasos, frecuencia cardíaca, sueño, ejercicio y peso en las funciones correspondientes. La disponibilidad y el uso de cada tipo de dato dependen de la funcionalidad, de los registros existentes y de los permisos autorizados.

### Reportes

La aplicación permite generar reportes de salud con información del período seleccionado y datos contextuales disponibles.

Los reportes pueden incluir estadísticas y tendencias fisiológicas cuando existen datos suficientes. También ofrecen opciones para generar PDF, copiar contenido y compartir documentos.

### Copias de seguridad y recuperación

CardioSync dispone de mecanismos de respaldo local, copias programadas, integración con Google Drive y recuperación de información.

- **Copia manual:** permite guardar una copia de la base de datos SQLite en una ubicación seleccionada mediante Android.
- **Google Drive:** permite almacenar copias en una carpeta de respaldo de CardioSync, previa autenticación y autorización.
- **Copias programadas:** utilizan mecanismos de ejecución disponibles en Android y dependen de la configuración y de las condiciones del sistema.
- **Recuperación:** la aplicación incluye servicios destinados a recuperar información mediante los mecanismos disponibles.

Las copias de seguridad deben verificarse periódicamente. La existencia de una función no garantiza por sí sola que una copia se haya completado correctamente.

## Actualizaciones de la aplicación

CardioSync dispone de dos mecanismos de actualización.

### Actualizaciones OTA

Las actualizaciones OTA permiten distribuir cambios compatibles de JavaScript y TypeScript mediante Expo Updates, sin generar una nueva APK cuando los cambios son compatibles con la versión instalada.

La aplicación permite configurar las comprobaciones y descargas automáticas de actualizaciones. La aplicación de una actualización descargada se gestiona por separado.

Los cambios que requieran modificaciones nativas pueden necesitar una nueva APK.

### Actualizaciones mediante APK

La aplicación permite consultar las versiones publicadas en GitHub Releases y comprobar si existe una versión más reciente.

El proceso de descarga valida aspectos del archivo como el tamaño, el paquete de la aplicación, la versión y la firma antes de solicitar la instalación.

Después de validar el archivo, CardioSync solicita al instalador de Android que gestione la instalación. El sistema puede requerir que el usuario autorice la instalación de aplicaciones desde esa fuente y confirme la operación.

La instalación no es silenciosa y está sujeta a los controles de seguridad de Android.

## Referencia clínica

La referencia clínica activa de CardioSync es el **Consenso Argentino de Hipertensión Arterial 2025**.

La documentación clínica del proyecto debe mantener la trazabilidad entre la fuente original, los criterios extraídos y las reglas implementadas.

La referencia clínica no implica que todas las recomendaciones estén implementadas ni que el motor clínico haya sido validado en su totalidad. La información de la aplicación no reemplaza el criterio de profesionales de la salud.

## Privacidad y datos

CardioSync utiliza distintos mecanismos según la funcionalidad:

- **Almacenamiento local:** la base de datos principal se guarda en SQLite dentro del almacenamiento de la aplicación.
- **Health Connect:** el acceso a datos de salud depende de los permisos concedidos por el usuario.
- **Google Drive:** las copias se transfieren al servicio de Google cuando el usuario configura y autoriza la integración.
- **Copias manuales:** el usuario selecciona la ubicación de destino mediante Android.
- **Actualizaciones:** la consulta de versiones utiliza GitHub Releases y la descarga obtiene el archivo publicado en el repositorio.

Estas operaciones implican distintos flujos de datos. Para conocer su funcionamiento detallado deben consultarse los documentos específicos de almacenamiento, Health Connect, copias de seguridad y actualizaciones.

## Tecnología

CardioSync utiliza React Native, Expo SDK 57, Expo Router y TypeScript.

Entre las tecnologías e integraciones del proyecto se encuentran:

- Expo SQLite para el almacenamiento local.
- Expo Updates para actualizaciones OTA.
- Android Health Connect para la integración de datos de salud.
- Google Drive para copias de seguridad.
- Integraciones nativas de Android para las funciones que lo requieren.
- Herramientas de visualización de datos utilizadas por el proyecto.

La lista exacta de dependencias se encuentra en `package.json`.

## Arquitectura

CardioSync utiliza una arquitectura modular organizada por funcionalidades, con separación entre dominio, capacidades compartidas y presentación.

La estructura principal es:

- `src/core`: capacidades y lógica compartidas.
- `src/domain`: conceptos y reglas del dominio.
- `src/features`: funcionalidades organizadas por área.
- `src/components`: componentes de presentación reutilizables.

El proyecto mantiene separados los puntos de entrada de producción y las herramientas de desarrollo. La estructura del repositorio es la referencia para conocer los módulos implementados en cada versión.

## Descargar CardioSync

Las versiones instalables de Android se publican en:

[GitHub Releases](https://github.com/lucas0706/CardioSync/releases)

Se recomienda descargar las APK desde las publicaciones oficiales del repositorio.

## Desarrollo

### Requisitos

- Node.js.
- npm.
- Git.
- Expo y EAS para las tareas correspondientes.
- Android Development Build para probar funcionalidades nativas.

### Ejecutar en desarrollo

Desde la raíz del proyecto:

```bash
npx expo start --dev-client --tunnel
```

### Comprobar TypeScript

Si el script está disponible en `package.json`:

```bash
npm run typecheck
```

### Producción

El proyecto dispone de un perfil de compilación de producción denominado `production-apk`.

Antes de generar una nueva APK deben verificarse el estado de Git, el commit, la versión y los cambios que puedan afectar la compatibilidad nativa.

La publicación de una APK y la publicación de una actualización OTA son procesos diferentes.

## Documentación del proyecto

La documentación técnica, clínica y operativa se encuentra en `docs/`.

Cada documento debe interpretarse según su propósito y vigencia: descripción del estado actual, especificación, decisión arquitectónica, checkpoint histórico o propuesta futura.

## Aviso médico

CardioSync es una herramienta de seguimiento personal de información de salud. No establece por sí sola un diagnóstico, no sustituye una evaluación profesional y no reemplaza un tratamiento indicado por profesionales de la salud.
