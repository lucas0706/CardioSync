# CardioSync

CardioSync es una aplicación Android para el seguimiento personal de la presión arterial y la información cardiovascular, con integración con Health Connect y generación de reportes clínicos.

## ¿Qué es CardioSync?

CardioSync permite centralizar mediciones cardiovasculares y complementar esa información con los datos disponibles en Android Health Connect. Su objetivo es ayudar a cada persona a registrar sus mediciones, visualizar tendencias, consultar estadísticas, generar reportes y conservar y respaldar su información.

La aplicación está orientada al seguimiento personal y no es una herramienta de diagnóstico médico.

## Funcionalidades

### Presión arterial

- Registro de presión sistólica y diastólica.
- Frecuencia cardíaca asociada a las mediciones.
- Fecha y hora de cada medición.
- Clasificación clínica de las mediciones.
- Historial de registros.

### Estadísticas

Consulta la evolución de las mediciones, sus promedios y tendencias mediante visualizaciones clínicas.

### Health Connect

CardioSync puede integrar datos disponibles en Android Health Connect, como pasos, frecuencia cardíaca, sueño, ejercicio y, cuando corresponda a otras partes de la aplicación, peso. Los datos disponibles dependen de la información registrada por los dispositivos y fuentes conectados, así como de los permisos que otorgue el usuario en Health Connect. No todos los dispositivos o fuentes proporcionan todos los tipos de datos.

### Reportes

La aplicación permite generar reportes clínicos que incluyen estadísticas del período seleccionado y contexto fisiológico de los últimos 30 días. Cuando hay datos disponibles, también pueden mostrar tendencias de pasos, frecuencia cardíaca, sueño y ejercicio. El reporte se puede generar como PDF, copiar como contenido o compartir en formato PDF.

### Copias de seguridad

CardioSync ofrece almacenamiento local de respaldo, copias programadas, integración con Google Drive y recuperación de información. Las copias programadas pueden ejecutarse mediante los mecanismos disponibles en Android.

### Exportación

Es posible exportar y compartir información relacionada con los reportes y los datos de salud.

### Perfil

El perfil permite mantener información personal que aporta contexto al seguimiento cardiovascular.

## Privacidad y datos

- Los datos de la aplicación se almacenan localmente en el dispositivo.
- La integración con Health Connect depende de los permisos concedidos por el usuario.
- Las copias a Google Drive solo se realizan si el usuario ha configurado y autorizado ese mecanismo.
- CardioSync no es un servicio médico ni un sistema de diagnóstico.

## Tecnología

CardioSync utiliza React Native con Expo SDK 57 y Expo Router, y está desarrollado en TypeScript. El almacenamiento local se implementa con SQLite mediante Expo SQLite. La integración con Android Health Connect y Google Drive permite acceder a las funciones correspondientes cuando están configuradas y autorizadas. Para gráficos y visualizaciones se utilizan React Native Skia, SVG y herramientas de visualización del proyecto.

## Arquitectura

La aplicación sigue una arquitectura modular basada en features, con separación entre dominio, lógica compartida y presentación. Entre sus directorios principales se encuentran:

- `src/core`: capacidades y lógica compartidas.
- `src/domain`: conceptos y reglas del dominio.
- `src/features`: funcionalidades organizadas por área.
- `src/components`: componentes de presentación reutilizables.

El proyecto también separa las herramientas de desarrollo de las rutas destinadas a producción.

## Production

CardioSync dispone de una configuración de producción independiente de las herramientas de desarrollo. Las herramientas de desarrollador se mantienen para Development Build y no forman parte del árbol de rutas de Production.

## Descargar

Las versiones instalables de Android se publican en [GitHub Releases](https://github.com/lucas0706/CardioSync/releases).

## Desarrollo

### Requisitos

- Node.js
- npm
- Git
- Expo / EAS
- Android Development Build para probar funcionalidades nativas

### Ejecutar en desarrollo

```bash
npx expo start --dev-client --tunnel
```

## Estado

CardioSync se encuentra en evolución activa y dispone de una configuración Production y herramientas de desarrollo separadas.

## Aviso médico

CardioSync está orientada al registro y visualización de información de salud y no sustituye una evaluación, diagnóstico ni tratamiento profesional.
