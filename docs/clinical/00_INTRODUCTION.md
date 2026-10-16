# Documentación clínica de CardioSync

| Campo | Valor |
|---|---|
| Tipo | Índice y alcance de documentación clínica |
| Estado | Guía de navegación; no es una guía médica |
| Fecha | 2026-10-15 |

## 1. Propósito

Esta carpeta documenta los conceptos clínicos utilizados o considerados por CardioSync, la relación entre las fuentes de referencia y las reglas implementadas, y los límites que deben respetarse al interpretar resultados.

CardioSync es una herramienta de registro y seguimiento. La información presentada por la aplicación no sustituye la evaluación de un profesional de salud ni debe interpretarse como diagnóstico autónomo.

## 2. Separación obligatoria de conceptos

Toda documentación clínica debe distinguir:

1. **Fuente publicada:** recomendación o definición contenida en un documento identificable.
2. **Interpretación del proyecto:** decisión explícita sobre cómo aplicar esa fuente al alcance de CardioSync.
3. **Regla implementada:** comportamiento que puede localizarse en el código.
4. **Validación:** evidencia de que la implementación produce el comportamiento esperado en los escenarios revisados.

La existencia de una guía en la lista de referencias no significa que todas sus recomendaciones estén implementadas. Tampoco significa que una regla implementada sea clínicamente validada.

## 3. Límites de interpretación

- No inventar umbrales, recomendaciones terapéuticas ni citas bibliográficas.
- Registrar organización/autores, título, versión, fecha y enlace o identificador de la fuente primaria cuando estén disponibles.
- Indicar qué población y contexto cubre una recomendación y qué exclusiones tiene.
- No asumir que diferentes guías son equivalentes.
- No presentar la ausencia de datos como un resultado normal ni como un valor igual a cero.
- No utilizar esta documentación como sustituto de una consulta médica.

Si falta la fuente primaria o no puede comprobarse la vigencia, la referencia debe quedar marcada como pendiente y no utilizarse para justificar una nueva regla clínica.

## 4. Navegación

- [Dominio clínico en la aplicación](../04_CLINICAL_DOMAIN.md): modelos y responsabilidades del dominio.
- [Motor de reglas clínicas](../05_CLINICAL_RULE_ENGINE.md): reglas y su ejecución.
- [Análisis clínico](../06_CLINICAL_ANALYSIS.md): composición e interpretación técnica de resultados.
- [Fuentes de guías clínicas](09_CLINICAL_GUIDELINE.md): inventario y estado de soporte de referencias.
- [Antropometría](05_ANTHROPOMETRY.md): campos, unidades, validaciones y fórmulas, cuando estén verificadas.
- [Roadmap general](../02_ROADMAP.md): estado general del proyecto.

Los documentos de guías en `guidelines/` deben considerarse referencias pendientes hasta que incluyan metadatos de fuente primaria y un análisis trazable. El nombre de archivo por sí solo no acredita que la publicación exista, esté vigente o sea utilizada por la aplicación.

## 5. Estado de validación

Esta introducción no certifica exactitud clínica ni el comportamiento completo de CardioSync. Para cada regla o recomendación se debe documentar por separado:

- fuente y versión;
- alcance y población;
- interpretación aprobada por el proyecto;
- archivo o función que implementa la regla;
- casos de prueba y resultado;
- limitaciones conocidas;
- fecha de última revisión.

Hasta completar esa evidencia, describir el contenido como diseño, implementación inspeccionada o pendiente, según corresponda.
