# Estado de comparación de guías clínicas

Versión: 1.1
Estado: Documento de alcance y arquitectura
Última revisión: 2026-10-17

## 1. Propósito

Este documento describe cómo podría evaluarse en el futuro la incorporación de otras guías clínicas. **No declara que CardioSync utilice actualmente múltiples guías.**

## 2. Alcance clínico actual

La única guía clínica utilizada actualmente por CardioSync es el **Consenso Argentino de Hipertensión Arterial 2025**.

Las referencias a ESC 2024, AHA/ACC 2025 e ISH 2020 que puedan permanecer en el repositorio son material documental histórico o de investigación; no forman parte del alcance clínico activo ni deben justificar reglas, resultados o recomendaciones actuales de la aplicación.

## 3. Posible evolución futura

Si el proyecto decide soportar otra guía en el futuro, la decisión debe aprobarse explícitamente antes de implementarla. La evaluación deberá incluir:

- fuente primaria y versión;
- diferencias clínicas concretas frente al consenso argentino;
- población y condiciones de aplicación;
- reglas que requerirían implementación separada;
- impacto en registros históricos, reportes y configuración;
- pruebas clínicas y técnicas;
- decisión documentada y revisión responsable.

Hasta que exista esa decisión, no deben implementarse comparaciones clínicas activas entre guías ni mezclarse umbrales de fuentes diferentes.

## 4. Principios arquitectónicos

La arquitectura puede mantener abstraídas las reglas clínicas sin afirmar que todas las estrategias estén activas. Cualquier futura guía adicional deberá tener una identificación inequívoca y trazabilidad propia; los análisis históricos deberán conservar la referencia efectivamente utilizada.

## 5. Estado

Este documento no certifica que exista soporte funcional completo para múltiples guías. La fuente clínica activa del producto sigue siendo exclusivamente el Consenso Argentino de Hipertensión Arterial 2025.
