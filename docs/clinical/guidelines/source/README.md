# Fuentes clínicas de CardioSync

## Fuente activa

La única guía clínica utilizada actualmente por CardioSync es el **Consenso Argentino de Hipertensión Arterial 2025**, conservado en `argentina/`.

Las reglas activas deben mantener trazabilidad directa con esa fuente primaria. La documentación de extracción no sustituye la revisión del documento original ni la validación de la implementación.

## Material documental no activo

Las carpetas `aha/`, `esc/` e `ish/` contienen referencias a otras guías que no forman parte del alcance clínico activo actual. Se conservan únicamente como material documental; no deben usarse como fundamento de reglas ni combinarse con el consenso argentino.

La existencia de estos materiales no implica que CardioSync ofrezca selección o análisis clínico basado en esas guías. Cualquier cambio de alcance requiere una decisión explícita, revisión clínica y trazabilidad de implementación.

## Reglas

- Toda regla activa debe citar la fuente primaria, versión y sección/página.
- Mantener separadas fuente, interpretación clínica e implementación.
- No mezclar criterios de diferentes guías en una regla vigente.
- Registrar pruebas, resultados observados y limitaciones.
- No declarar validación clínica solo por la presencia de código o documentación.
