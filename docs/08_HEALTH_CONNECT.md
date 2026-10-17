# CardioSync — Health Connect Integration

| Campo | Valor |
|-------|--------|
| Documento | 08_HEALTH_CONNECT.md |
| Tipo | Diseño Conceptual de Integración |
| Estado | Parcialmente implementado |
| Versión | Sincronizada con la versión del proyecto |
| Última actualización | 2026-08-03 |

---

# Objetivo

Este documento define el diseño conceptual de la integración futura con Health Connect.

No contiene implementación.

Su finalidad es establecer qué información podrá ser incorporada, cómo será transformada y qué módulos podrán consumirla.

---

# Principio fundamental

Health Connect será una fuente externa de contexto.

No será parte del núcleo de CardioSync.

CardioSync seguirá siendo una aplicación especializada en seguimiento de presión arterial.

La integración con Health Connect tendrá como objetivo enriquecer la evaluación clínica cuando exista información disponible.

---

# Restricción principal

Health Connect nunca modificará:

- BloodPressureRecord.
- Measurement Domain.
- Datos originales de mediciones.

Los datos externos serán transformados en contextos especializados.

---

# Datos potencialmente disponibles

## Sleep

SleepContext

Datos posibles:

- Duración del sueño.
- Horarios.
- Calidad del sueño si está disponible.
- Periodos de descanso.

---

## Actividad física

ActivityContext

Datos posibles:

- Pasos.
- Distancia.
- Calorías.
- Tiempo activo.
- Intensidad de actividad.

---

## Composición corporal

BodyCompositionContext

Datos posibles:

- Peso.
- Altura.
- Body Fat.
- Lean Mass.

---

## Signos vitales

VitalSignsContext

Datos posibles:

- Frecuencia cardíaca.
- Frecuencia cardíaca en reposo.
- HRV si está disponible.
- VO₂ Max si está disponible.
- SpO₂.
- Frecuencia respiratoria.
- Temperatura.

---

## Otros datos

Podrán incorporarse nuevos tipos de información en el futuro siempre que:

- Tengan relación clínica.
- Estén disponibles mediante una fuente autorizada.
- Mantengan la arquitectura de contextos.

---

# Flujo de integración

Health Connect

↓

Adaptador de integración

↓

Contextos especializados

↓

ClinicalContext

↓

Clinical Rule Engine

↓

Clinical Analysis Engine

---

# Mapeo de información

## Sleep

Health Connect

↓

SleepContext

↓

ClinicalContext

---

## Actividad

Health Connect

↓

ActivityContext

↓

ClinicalContext

---

## Composición corporal

Health Connect

↓

BodyCompositionContext

↓

ClinicalContext

---

## Signos vitales

Health Connect

↓

VitalSignsContext

↓

ClinicalContext

---

# Módulos consumidores

Los datos provenientes de Health Connect podrán ser utilizados por:

## ClinicalContextBuilder

Responsabilidad:

Construir el contexto clínico completo con la información disponible.

---

## ClinicalRuleEngine

Responsabilidad:

Aplicar reglas clínicas cuando exista información suficiente.

---

## ClinicalAnalysisEngine

Responsabilidad:

Integrar los resultados clínicos.

---

## ClinicalReports

Responsabilidad:

Incorporar información adicional en reportes cuando corresponda.

---

## Dashboard dinámico

Responsabilidad:

Mostrar información adicional cuando exista.

---

# Manejo de datos ausentes

Los datos de Health Connect son opcionales.

Ejemplos:

Sin datos de sueño:

SleepContext no disponible.

El sistema continúa funcionando.

Sin datos de actividad:

ActivityContext no disponible.

El sistema continúa funcionando.

Sin Health Connect:

CardioSync funciona únicamente con sus datos propios.

---

# Restricciones

- Health Connect no modifica BloodPressureRecord.
- Health Connect no define reglas clínicas.
- Health Connect no reemplaza las mediciones propias.
- La ausencia de datos externos no genera errores.
- Los datos externos solo agregan contexto.

---

# Evolución prevista

La integración comenzará después de:

1. Finalizar refactorización del dominio.
2. Implementar Clinical Domain.
3. Implementar Clinical Rule Engine.
4. Implementar Clinical Analysis Engine.

---

# Estado de implementación — 2026-10-17

El estado general de esta integración ya no corresponde a **Planificado**: el repositorio contiene una feature `src/features/healthConnect/` con servicio de conexión, coordinador, servicios de sincronización, mappers y construcción de resúmenes.

## Capacidades identificadas en el código

- Servicio y coordinación de Health Connect.
- Sincronización de pasos, sueño, frecuencia cardíaca, ejercicio y peso mediante servicios dedicados.
- Mappers para transformar datos externos en estructuras internas.
- Construcción de agregados y resúmenes para consumo de la aplicación.
- Servicios de configuración y estado de la integración.

## Límites que deben mantenerse explícitos

- La presencia de servicios y mappers no demuestra que cada permiso, lectura, paginación, sincronización incremental o escenario de revocación se haya validado en dispositivos reales.
- No asumir que todas las categorías enumeradas en la sección conceptual están implementadas: la lista anterior se limita a los módulos identificados en el árbol de código.
- Health Connect sigue siendo una fuente externa. No debe modificar los valores originales de `BloodPressureRecord` ni sustituir las mediciones registradas en CardioSync.
- Los datos externos deben conservar su origen y disponibilidad opcional; la ausencia de permisos o de datos no debe convertirse en una afirmación clínica.

## Próxima validación recomendada

Verificar en un dispositivo Android compatible los permisos concedidos y revocados, la lectura por categoría, la sincronización repetida sin duplicados, los períodos sin datos y los errores de conexión. Hasta completar estas pruebas, documentar el estado como **implementado en código / validación de dispositivo pendiente**, no como integración plenamente validada.

Esta actualización se basa en la estructura de archivos de la feature en la rama de referencia; no se ejecutaron pruebas de Health Connect durante esta revisión.
