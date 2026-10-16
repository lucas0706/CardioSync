# Reportes

CardioSync permite preparar un reporte de seguimiento a partir de las mediciones registradas y generar una versión PDF para conservarla o compartirla. El flujo de reportes se encuentra en `src/features/reports`.

## Reporte de seguimiento

El reporte está orientado a mostrar de forma organizada la información del período elegido. El contenido depende de las mediciones disponibles y de las opciones que ofrece la pantalla de reportes.

El flujo de usuario general es:

1. Abrir **Más → Reportes**.
2. Elegir un período o rango de fechas.
3. Revisar los datos y la vista previa.
4. Copiar el contenido o generar el PDF.
5. Utilizar las opciones disponibles del sistema para compartir o imprimir el documento.

La pantalla impide iniciar la generación cuando no hay mediciones en el período o cuando falta completar el rango personalizado.

## Gráfico de evolución

El PDF puede incluir un gráfico temporal con tres series:

| Clave | Etiqueta | Unidad |
|---|---|---|
| `systolic` | Sistólica | mmHg |
| `diastolic` | Diastólica | mmHg |
| `heartRate` | Frecuencia cardíaca | lpm |

Las definiciones de las series se comparten con el gráfico de la aplicación desde `src/components/charts/ClinicalChart/constants/clinicalSeries.ts`. Esto permite mantener centralizados los nombres, las unidades y los colores de las series.

El servicio `src/features/reports/services/ReportClinicalChartService.ts` construye una representación SVG/HTML para el PDF. El componente React Native del gráfico no se inserta directamente en el HTML de impresión; por eso el reporte utiliza un renderer específico que consume los datos preparados por `buildChartData`.

Si no hay registros o no hay valores numéricos disponibles para graficar, el renderer devuelve una sección explicando que no hay datos suficientes para mostrar el gráfico.

## Generación del PDF

La generación utiliza contenido HTML procesado por el flujo de impresión de Expo. El gráfico se incorpora como SVG dentro de ese contenido. Esta separación permite que la vista de reporte y el documento impreso utilicen los datos de la misma función de preparación de gráficos sin intentar renderizar un componente nativo dentro del HTML.

## Reporte del paciente y reporte médico

La funcionalidad descrita en esta guía es el reporte de seguimiento disponible en la aplicación. Un reporte médico independiente, con formato clínico especializado y trazabilidad completa de reglas, debe tratarse como una funcionalidad distinta y no inferirse únicamente a partir de la existencia del PDF actual.

## Relación con estadísticas y análisis clínico

Las estadísticas describen las mediciones del período seleccionado. El análisis clínico, cuando está integrado en el flujo correspondiente, aporta hallazgos generados por reglas clínicas. El reporte organiza la información que recibe; no debería sustituir el cálculo estadístico ni ejecutar por su cuenta las reglas clínicas.

```text
Período seleccionado
       ↓
Mediciones y estadísticas disponibles
       ↓
Preparación del reporte
       ↓
Vista previa
       ↓
HTML + gráfico SVG
       ↓
PDF / compartir / imprimir
```

## Privacidad

Los reportes pueden contener datos personales y de salud. Antes de compartir o imprimir un documento, revisá su contenido y comprobá el destino. El PDF es una representación del período y de los datos disponibles al generarlo; no es un reemplazo del historial almacenado en la aplicación.

## Archivos relacionados

- `src/features/reports/`
- `src/features/reports/services/ReportClinicalChartService.ts`
- `src/components/charts/ClinicalChart/constants/clinicalSeries.ts`
- `src/components/charts/ClinicalChart/utils/buildChartData.ts`
- [Guía de uso](15_USER_GUIDE.md)
- [Estadísticas](11_MODULES.md)
- [Análisis clínico](06_CLINICAL_ANALYSIS.md)