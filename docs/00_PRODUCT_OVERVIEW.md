# CardioSync — descripción funcional del producto

| Campo | Valor |
|---|---|
| Tipo | Descripción funcional del producto |
| Última revisión | 2026-10-15 |
| Plataforma principal | Android |

## 1. ¿Qué es CardioSync?

CardioSync es una aplicación Android para el seguimiento personal de la presión arterial y la organización de información relacionada con la salud cardiovascular. Permite registrar mediciones, revisar el historial, observar estadísticas y tendencias, generar reportes y conservar los datos mediante mecanismos de respaldo.

La aplicación puede complementar el seguimiento con información disponible en Android Health Connect, según los datos que aporten las fuentes conectadas y los permisos concedidos por la persona usuaria.

CardioSync es una herramienta de registro y seguimiento. No diagnostica enfermedades, no reemplaza una consulta médica ni debe utilizarse como única base para tomar decisiones urgentes sobre la salud.

## 2. Qué permite hacer

### 2.1 Registrar la presión arterial

La función principal permite guardar mediciones de presión arterial sistólica y diastólica. Según el flujo de registro, la medición puede incluir frecuencia cardíaca, fecha y hora, y otros datos de contexto admitidos por la aplicación.

El historial reúne las mediciones guardadas para facilitar su consulta y seguimiento. Los registros pueden consultarse en detalle y la aplicación dispone de flujos de gestión de mediciones, incluidos edición y eliminación.

### 2.2 Consultar la evolución

CardioSync presenta resúmenes y estadísticas derivados de las mediciones almacenadas. Estas vistas ayudan a observar promedios, cambios y tendencias a lo largo del tiempo.

Las estadísticas describen los datos registrados; no deben confundirse con una evaluación médica. La interpretación clínica depende de las reglas que estén implementadas y de los datos disponibles.

### 2.3 Comprender la clasificación de las mediciones

La aplicación incluye lógica de clasificación de presión arterial y módulos de dominio clínico. La clasificación debe interpretarse dentro de sus límites y no como un diagnóstico independiente. Las reglas clínicas, sus fuentes y su alcance se documentan en [Dominio clínico](04_CLINICAL_DOMAIN.md), [Motor de reglas](05_CLINICAL_RULE_ENGINE.md) y [Análisis clínico](06_CLINICAL_ANALYSIS.md).

### 2.4 Generar y compartir reportes

CardioSync incluye servicios para construir reportes y generar documentos PDF. El reporte puede representar la evolución temporal de presión sistólica, diastólica y frecuencia cardíaca. También existen flujos para compartir, copiar o imprimir contenido del reporte.

El contenido exacto depende del tipo de reporte, el período seleccionado y los datos disponibles. La especificación funcional se encuentra en [Reportes](07_REPORTS.md).

### 2.5 Integrar datos mediante Health Connect

La integración permite acceder a datos de salud disponibles en Health Connect, como presión arterial, pasos, frecuencia cardíaca, sueño, ejercicio y peso, cuando el dispositivo, las aplicaciones de origen y los permisos lo permiten.

La disponibilidad no está garantizada para todos los tipos de datos ni para todos los dispositivos. La información externa complementa el seguimiento, pero no reemplaza las mediciones registradas en CardioSync. Más detalles en [Health Connect](08_HEALTH_CONNECT.md).

### 2.6 Conservar y recuperar información

El proyecto contiene funciones de almacenamiento local y servicios relacionados con copias de seguridad y restauración. También contempla copias programadas y un mecanismo de respaldo en Google Drive cuando se encuentra configurado y autorizado.

Como los datos de salud son importantes, una copia debe considerarse confiable solo después de comprobar que se generó correctamente y que puede restaurarse. La documentación de datos y persistencia está en [Base de datos e intercambio de datos](09_DATABASE.md).

### 2.7 Importar y exportar datos

CardioSync dispone de código para importar históricos desde archivos externos. Los formatos aceptados y el tratamiento de errores dependen de los parsers y validaciones implementados en la versión correspondiente. Los reportes también pueden exportarse o compartirse en los formatos disponibles en la aplicación.

### 2.8 Consultar información de la aplicación y sus actualizaciones

La aplicación incluye una sección de información y configuración de actualización. La distribución Android contempla APK de producción y un mecanismo de actualizaciones OTA para cambios compatibles con el runtime instalado. Los procedimientos y límites están descritos en [Versiones, actualizaciones y distribución](14_RELEASES_AND_UPDATES.md).

## 3. Recorrido funcional general

Un uso habitual de CardioSync puede describirse así:

1. La persona registra una medición de presión arterial.
2. La aplicación valida y guarda los datos localmente.
3. La medición aparece en el historial y contribuye a los resúmenes y gráficos que correspondan.
4. La persona revisa la evolución en el dashboard y las estadísticas.
5. Si lo necesita, genera un reporte para conservarlo o compartirlo.
6. Si la integración está disponible y autorizada, CardioSync puede complementar la información con datos de Health Connect.
7. La persona utiliza los mecanismos de respaldo disponibles para proteger sus registros.

Los pasos concretos y las opciones visibles pueden variar según la versión instalada y la configuración.

## 4. Datos, privacidad y control

- Los registros propios de CardioSync se almacenan localmente mediante la capa de persistencia de la aplicación.
- El acceso a Health Connect depende de los permisos que conceda la persona usuaria.
- El respaldo en Google Drive requiere la configuración y autorización correspondientes.
- Compartir o exportar un reporte puede trasladar información de salud fuera del almacenamiento local; antes de hacerlo, se debe comprobar el destino.
- La disponibilidad de datos externos depende de los dispositivos y aplicaciones que los hayan registrado.

Esta descripción no sustituye una política de privacidad legal ni detalla todos los datos técnicos procesados por cada integración.

## 5. Límites de uso

CardioSync no es un dispositivo médico certificado por esta documentación ni una herramienta de diagnóstico. La clasificación automática, las estadísticas y los reportes son ayudas para el seguimiento personal y no sustituyen la valoración de profesionales de salud.

Ante síntomas graves o una situación urgente, no se debe esperar a que la aplicación genere un resultado o reporte para buscar atención médica.

## 6. Cómo leer el resto de la documentación

Para una explicación paso a paso de las pantallas y las operaciones de usuario, consultar la [Guía de uso de CardioSync](15_USER_GUIDE.md).

- [Arquitectura](01_ARCHITECTURE.md): cómo se organiza técnicamente la aplicación.
- [Dominio clínico](04_CLINICAL_DOMAIN.md), [reglas](05_CLINICAL_RULE_ENGINE.md) y [análisis](06_CLINICAL_ANALYSIS.md): cómo se modela y procesa la información clínica.
- [Reportes](07_REPORTS.md): composición y generación de reportes.
- [Health Connect](08_HEALTH_CONNECT.md): integración con datos de salud externos.
- [Base de datos](09_DATABASE.md): persistencia, importación y recuperación.
- [Módulos](11_MODULES.md) y [estructura de carpetas](12_FOLDER_STRUCTURE.md): ubicación y responsabilidades del código.
- [Versiones y distribución](14_RELEASES_AND_UPDATES.md): instalación, actualización y publicación.
- [Historial de cambios](10_CHANGELOG.md): evolución registrada del proyecto.

Los documentos técnicos describen diseño e implementación. Cuando un comportamiento dependa de permisos, un dispositivo o un servicio externo, debe verificarse en la versión concreta antes de darlo por garantizado.
