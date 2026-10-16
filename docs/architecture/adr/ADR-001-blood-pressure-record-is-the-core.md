# ADR-001 — La medición de presión arterial es el núcleo del dominio

| Campo | Valor |
|---|---|
| Estado | Propuesto para revisión |
| Fecha de documentación | 2026-10-15 |
| Alcance | Modelo de dominio y funcionalidades dependientes de la medición |
| Evidencia inspeccionada | `src/domain/clinical/classification/BloodPressureClassifier.ts`, `docs/04_CLINICAL_DOMAIN.md`, `docs/03_DECISIONS.md` |

## Contexto

CardioSync se centra en el registro y seguimiento de mediciones de presión arterial. El repositorio también incluye estadísticas, contexto clínico, reportes e integraciones externas. Estas capacidades amplían la interpretación y el uso de los datos, pero no deben desplazar el registro de presión arterial como propósito principal.

La documentación arquitectónica existente describe la medición como el núcleo y los datos externos como contexto complementario. El clasificador inspeccionado recibe valores sistólicos y diastólicos y produce una clasificación; no requiere que la interfaz ejecute directamente la lógica de clasificación.

## Problema

Si el modelo central se adapta a cada integración o concentra todos los datos derivados y contextuales, se incrementa el acoplamiento y se vuelve más difícil mantener la captura, persistencia, clasificación y evolución histórica de una medición.

## Decisión propuesta

Mantener la medición de presión arterial como entidad central del flujo funcional de CardioSync.

- Los datos propios de una medición deben permanecer diferenciados de los datos contextuales del paciente y de los datos provenientes de fuentes externas.
- La clasificación y demás interpretaciones deben producir resultados derivados, sin convertirlos automáticamente en datos originales de la medición.
- Las integraciones externas deben adaptarse al modelo interno mediante sus propias capas de validación y transformación.
- La disponibilidad de datos externos no debe convertirse en un requisito general para registrar o consultar mediciones.

Esta decisión no define por sí sola el esquema completo de la entidad ni aprueba cambios concretos de migración. Los campos y las relaciones deben verificarse en el modelo y en la persistencia actuales antes de realizar refactorizaciones.

## Alternativas consideradas

1. **Convertir el modelo principal en un contenedor de toda la información clínica.** Se descarta como dirección de diseño porque mezcla responsabilidades y aumenta el acoplamiento.
2. **Hacer que cada integración defina su propio modelo central.** Se descarta porque fragmentaría el historial y acoplaría el dominio a proveedores externos.
3. **Mantener la medición como núcleo y representar aparte los datos contextuales y derivados.** Es la opción propuesta por ser consistente con el objetivo funcional y la documentación arquitectónica existente.

## Consecuencias

### Positivas esperadas

- El flujo de registro puede mantenerse independiente de integraciones opcionales.
- Las reglas de clasificación pueden probarse separadas de la interfaz.
- Los datos externos pueden evolucionar sin redefinir la finalidad de la entidad principal.
- Se hace más clara la diferencia entre valores registrados y resultados calculados.

### Costes y riesgos

- Deben definirse relaciones claras entre mediciones, contexto y resultados derivados.
- Las migraciones requieren especial cuidado para no perder datos históricos.
- La separación conceptual no garantiza por sí sola que todos los servicios actuales respeten este límite; es necesario inspeccionar consumidores y pruebas.

## Qué podría romper este principio

- Añadir campos de proveedores externos directamente al modelo principal sin justificar la relación.
- Guardar resultados derivados como si fueran valores originales sin identificar su procedencia.
- Hacer que el registro de presión arterial dependa de que Health Connect esté disponible.
- Duplicar reglas de clasificación entre dominio y presentación.

## Diagnóstico

Ante un cambio del modelo, comprobar:

1. Si el dato describe la medición original, al paciente, una fuente externa o un cálculo.
2. Si el cambio obliga a importar dependencias de infraestructura en el dominio.
3. Si el registro básico sigue funcionando sin datos externos.
4. Si la procedencia de los datos derivados queda identificada.
5. Si existen pruebas para los consumidores afectados y para la persistencia histórica.

## Evidencia y límites

El clasificador inspeccionado confirma que existe una responsabilidad de clasificación independiente de la UI en el dominio. No demuestra por sí solo que toda la persistencia y todos los consumidores cumplan este principio. La validación integral queda pendiente.

## Documentos relacionados

- [Constitución del proyecto](../../00_CARDIOSYNC_CONSTITUTION.md)
- [Arquitectura](../../01_ARCHITECTURE.md)
- [Decisiones arquitectónicas](../../03_DECISIONS.md)
- [Dominio clínico](../../04_CLINICAL_DOMAIN.md)
- [Brechas documentales](../../18_DOCUMENTATION_GAPS.md)
