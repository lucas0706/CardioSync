# Fuentes de guías clínicas: inventario y trazabilidad

| Campo | Valor |
|---|---|
| Tipo | Registro de fuentes y estado de soporte |
| Estado | Inventario inicial; referencias pendientes de verificación |
| Fecha | 2026-10-15 |

## 1. Objetivo

Este documento controla la relación entre las fuentes clínicas consideradas por el proyecto y las reglas que CardioSync implementa. No es una guía médica ni reemplaza los documentos primarios.

## 2. Estado de referencias

Los nombres de archivo siguientes proceden del árbol documental del repositorio. Su existencia no confirma por sí sola la publicación, su versión, su vigencia ni que sus recomendaciones estén implementadas.

| Referencia documental | Estado en esta auditoría | Evidencia requerida antes de considerarla activa |
|---|---|---|
| [AHA/ACC 2025](guidelines/AHA_ACC_2025.md) | Pendiente de verificación de fuente primaria | Título oficial, autores/organización, publicación, versión, enlace primario y secciones utilizadas |
| [Argentina 2025](guidelines/ARGENTINA_2025.md) | Pendiente de verificación de fuente primaria | Organismo o sociedad responsable, título oficial, autores, fecha, publicación y secciones utilizadas |
| [ESC 2024](guidelines/ESC_2024.md) | Pendiente de verificación de fuente primaria | Documento oficial, versión, publicación, alcance y secciones utilizadas |
| [ISH 2020](guidelines/ISH_2020.md) | Pendiente de verificar vigencia | Fuente primaria y revisión explícita de su vigencia frente a las referencias más recientes |

## 3. Registro obligatorio por recomendación utilizada

Antes de asociar una guía con una regla de la aplicación, registrar:

- **Identificación de fuente:** título, organización/autores, año, versión y enlace o DOI oficial.
- **Ubicación exacta:** capítulo, sección, tabla o recomendación relevante.
- **Alcance:** población, condiciones clínicas, exclusiones y contexto de medición.
- **Interpretación del proyecto:** cómo se traduce la recomendación a una regla de software y quién aprobó esa interpretación.
- **Implementación:** ruta del archivo y símbolo de código que ejecuta la regla.
- **Validación:** casos de prueba, valores de entrada, resultado esperado y resultado observado.
- **Limitaciones:** aspectos que no cubre la regla y posibles diferencias con otras guías.
- **Revisión:** fecha y responsable de la última comprobación de la fuente.

## 4. Reglas de uso documental

1. No derivar una regla clínica de un nombre de archivo, resumen secundario o recuerdo no verificado.
2. No combinar umbrales de guías distintas sin una decisión explícita y trazable.
3. No presentar una recomendación publicada como comportamiento implementado hasta localizar y revisar el código.
4. No presentar comportamiento implementado como clínicamente validado sin pruebas y revisión apropiadas.
5. Si la fuente primaria no está disponible, mantener la referencia pendiente y no utilizarla como fundamento de una nueva regla.
6. Registrar diferencias entre guías en lugar de resolverlas silenciosamente.

## 5. Relación con el código

El estado de cada regla debe contrastarse con [Dominio clínico](../04_CLINICAL_DOMAIN.md), [Motor de reglas](../05_CLINICAL_RULE_ENGINE.md) y [Análisis clínico](../06_CLINICAL_ANALYSIS.md). Esta referencia no certifica que todas las reglas del código correspondan a una guía concreta.

## 6. Próxima revisión

La siguiente tarea es localizar las publicaciones primarias oficiales y completar las fichas individuales de `guidelines/`. Hasta entonces, los archivos individuales permanecen como pendientes y no deben citarse como evidencia clínica verificada.
