# Regla de tendencia de presión arterial — retirada

**Estado: retirada del código vigente.**

La implementación anterior utilizaba `TrendCalculator` para comparar el primer
y el último valor sistólico del período y clasificaba el resultado como
ascendente, descendente o estable. `TrendRule` utilizaba esa clasificación para
generar un hallazgo clínico.

Esta lógica fue retirada porque su implementación no establecía un método
clínico suficientemente fundamentado para interpretar una tendencia individual.
La diferencia entre dos extremos no constituye, por sí sola, una evaluación
clínica validada de la evolución de la presión arterial.

La documentación se conserva como registro histórico. Esta regla ya no forma
parte del motor clínico ni debe interpretarse como una funcionalidad activa.

La retirada no modifica los cálculos de promedios, máximos, mínimos,
desviaciones estándar, variabilidad, carga hipertensiva, tiempo en objetivo,
regularidad de registros ni clasificación de presión arterial.
