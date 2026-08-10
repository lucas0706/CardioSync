# CardioSync — Checkpoint Statistics V2
## 2026-08-10

### Estado

Checkpoint funcional de la evolución del módulo Statistics V2 y de la integración del ClinicalChart.

### Estadísticas

El módulo de estadísticas utiliza los registros reales obtenidos mediante `useMeasurements()` y aplica el filtro temporal definido por `useStatistics()`.

La pantalla de estadísticas integra:

- selector de período;
- rango personalizado;
- gráfico clínico;
- resumen estadístico;
- clasificación de presión arterial.

### ClinicalChart

El gráfico clínico quedó preparado para representar múltiples variables en un único CartesianChart.

Series principales utilizadas en Statistics:

1. Sistólica
   - Unidad: mmHg
   - Color: verde `#388E3C`

2. Diastólica
   - Unidad: mmHg
   - Color: azul `#1976D2`

3. Frecuencia cardíaca
   - Unidad: lpm
   - Color: rojo `#D32F2F`

Las series se diferencian visualmente mediante color y leyenda.

### Ejes

El gráfico utiliza:

- eje X temporal;
- fechas en formato `DD/MM`;
- eje Y numérico;
- etiquetas numéricas visibles;
- fuente Skia mediante `useClinicalChartFont`;
- líneas de referencia para presión arterial cuando corresponden.

### Datos

Los datos se construyen mediante:

`buildChartData()`

y se ordenan cronológicamente por `dateTime`.

El proceso conserva:

- systolic;
- diastolic;
- heartRate;
- weight;
- glucose;
- spo2;
- temperature;
- respiratoryRate.

El downsampling se mantiene limitado a 500 puntos.

### Arquitectura

Se mantiene la arquitectura existente:

- `src/core`
- `src/domain`
- `src/features`
- `src/components`

Statistics continúa utilizando el dominio estadístico existente y no incorpora lógica clínica directamente en la pantalla.

### Dependencias

No se incorporan nuevas dependencias para este checkpoint.

La implementación utiliza las dependencias existentes:

- Expo SDK 57
- TypeScript strict
- victory-native
- @shopify/react-native-skia
- react-native-svg

### Validaciones

Antes del checkpoint:

- `npx tsc --noEmit` → limpio
- `git diff --check` → limpio

### Decisiones visuales

Se decidió representar las tres variables principales en el mismo gráfico aunque utilicen unidades diferentes.

La unidad de cada serie se comunica mediante la leyenda:

- Sistólica — mmHg
- Diastólica — mmHg
- Frecuencia cardíaca — lpm

Esto evita separar artificialmente las variables en gráficos diferentes y permite comparar visualmente su evolución temporal.

### Alcance del checkpoint

Este checkpoint cierra la corrección visual y funcional del gráfico de Statistics V2.

No implica todavía la finalización de todo el roadmap clínico de CardioSync.

### Próximo paso

A partir de este checkpoint, cualquier modificación del gráfico debe partir de este estado estable y evitar regresiones en:

- renderizado de FC;
- renderizado de sistólica/diastólica;
- etiquetas de ejes;
- fechas;
- leyenda;
- colores;
- compilación TypeScript.
