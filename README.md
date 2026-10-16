# CardioSync

CardioSync es una aplicación Android para el seguimiento personal de la presión arterial y la organización de información relacionada con la salud cardiovascular.

Permite registrar mediciones, consultar el historial, observar estadísticas y tendencias, generar reportes y conservar los datos mediante mecanismos de respaldo. Cuando está disponible y autorizada, la integración con Android Health Connect puede complementar el seguimiento con información de otras fuentes de salud.

CardioSync está orientada al registro y seguimiento personal. No diagnostica enfermedades ni reemplaza la evaluación de un profesional de salud.

## Funcionalidades principales

- **Presión arterial:** registro de presión sistólica y diastólica, frecuencia cardíaca asociada cuando corresponde, fecha y hora, historial y gestión de mediciones.
- **Dashboard y estadísticas:** resúmenes, promedios, visualizaciones y tendencias de los registros.
- **Clasificación clínica:** lógica de clasificación y módulos de dominio clínico para procesar mediciones dentro de reglas definidas.
- **Reportes:** generación de reportes PDF y opciones para compartir, copiar o imprimir contenido según el flujo disponible.
- **Health Connect:** integración con los tipos de datos de salud disponibles y autorizados en el dispositivo.
- **Copias de seguridad y recuperación:** almacenamiento local de datos y servicios de backup/restauración; la disponibilidad de opciones como copias programadas o Google Drive depende de la configuración.
- **Importación y exportación:** herramientas para importar históricos y compartir información en los formatos admitidos por la versión instalada.
- **Actualizaciones:** distribución Android mediante APK y actualizaciones OTA cuando el cambio es compatible con el runtime instalado.

Para conocer el propósito, los flujos y los límites de cada función, consulta la [descripción funcional del producto](docs/00_PRODUCT_OVERVIEW.md).

## Tecnología

CardioSync utiliza React Native con Expo SDK 57, Expo Router y TypeScript. La persistencia local utiliza SQLite a través de Expo SQLite. El proyecto integra componentes y servicios para visualizaciones, Health Connect, generación de reportes y distribución de actualizaciones.

## Arquitectura

La aplicación utiliza una organización modular basada en funcionalidades (*features*) y separación de responsabilidades. Entre los directorios principales se encuentran:

- `src/core`: capacidades compartidas.
- `src/domain`: conceptos y reglas del dominio.
- `src/features`: funcionalidades organizadas por área.
- `src/components`: componentes reutilizables de presentación.

El repositorio también contiene otras áreas compartidas, clínicas y de infraestructura. Su descripción completa está en la [documentación de arquitectura](docs/01_ARCHITECTURE.md).

## Descargar CardioSync

Las versiones instalables de Android se publican en [GitHub Releases](https://github.com/lucas0706/CardioSync/releases).

## Desarrollo

### Requisitos

- Node.js
- npm
- Git
- Expo y EAS CLI según la tarea
- Una Development Build para probar funcionalidades nativas

### Iniciar el entorno

```bash
npx expo start --dev-client --tunnel
```

## Documentación

El [índice de documentación](docs/README.md) organiza las guías funcionales, clínicas, arquitectónicas y operativas del proyecto.

## Aviso de uso

La aplicación ayuda a registrar y visualizar información de salud. La clasificación, las estadísticas y los reportes no sustituyen una evaluación, diagnóstico ni tratamiento profesional. En situaciones urgentes, no se debe esperar a que la aplicación produzca un resultado para buscar atención médica.
