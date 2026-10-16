# CardioSync — Health Connect Integration

| Campo | Valor |
|-------|--------|
| Documento | 08_HEALTH_CONNECT.md |
| Tipo | Integración: diseño y referencia de implementación |
| Estado | Implementación presente; validación funcional y de permisos pendiente |
| Versión | Sincronizada con la versión del proyecto |
| Última actualización | 2026-10-15 |

---

# Objetivo

Este documento describe los límites y el diseño de la integración con Health Connect.

La rama auditada contiene servicios para inicialización, permisos, sincronización y lectura de presión arterial y otros registros de salud, incluyendo pasos, frecuencia cardíaca, sueño, ejercicio y peso. La disponibilidad real depende de los permisos otorgados, los datos presentes en Health Connect, la versión del dispositivo y las pruebas funcionales.

---

> **Alcance funcional:** CardioSync consulta los tipos de registros implementados y autorizados en Health Connect. Los datos disponibles dependen de las fuentes conectadas y los permisos; un permiso concedido no garantiza que exista información para ese tipo de registro.

# Principio fundamental

Health Connect es una fuente externa de datos de salud y contexto.

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

# Implementación inspeccionada

La rama auditada contiene estos servicios principales:

| Componente | Responsabilidad observada en el código |
|---|---|
| `HealthConnectService` | Inicializa Health Connect y solicita permisos de lectura/escritura para determinados tipos de registros. |
| `HealthConnectCoordinator` | Coordina lecturas recientes de frecuencia cardíaca, pasos, sueño, ejercicio y peso. |
| `HealthConnectSettingsService` | Guarda en SQLite si la integración está habilitada y marcas temporales de configuración/actualización. |
| `HealthConnectSyncService` | Exporta mediciones de presión arterial de CardioSync hacia Health Connect y contiene una operación para borrar registros asociados a CardioSync. |
| `HealthConnectPagination` | Lee páginas sucesivas de registros hasta que no queda un token de página. |
| `HealthAggregateService` | Consulta agregados de pasos del día y promedio de frecuencia cardíaca. |

Los servicios de lectura consultados usan una ventana reciente de 30 días para frecuencia cardíaca, pasos, sueño, ejercicio y peso. Este detalle debe actualizarse si cambia el rango en el código.

## Permisos y límites

El servicio inspeccionado solicita permisos para:
- Presión arterial: lectura y escritura.
- Frecuencia cardíaca, pasos, sueño y ejercicio: lectura.
- Peso: lectura y escritura.
- Saturación de oxígeno: lectura y escritura.

Esta lista describe lo que solicita el código, no una garantía de que el usuario conceda todos los permisos ni de que cada tipo de registro esté disponible en el dispositivo. La implementación de solicitud de permisos devuelve un indicador booleano; la aceptación parcial o el estado efectivo de cada permiso deben verificarse en la integración y en la UI antes de asumir acceso completo.

La presencia de una función de exportación no demuestra que todas las mediciones se hayan sincronizado. Deben comprobarse los resultados, errores, duplicados y permisos reales en pruebas de dispositivo.

## Riesgo operativo a revisar

El servicio `HealthConnectSyncService` incluye una operación que busca registros de presión arterial con identificadores de cliente y solicita su eliminación en Health Connect. Antes de ejecutar o ampliar ese flujo, validar en dispositivo que los identificadores y el alcance de borrado correspondan exclusivamente a los registros de CardioSync. No interpretar esta función como un borrado general de Health Connect.

# Manejo de datos ausentes

Los datos de Health Connect son opcionales. La disponibilidad depende de permisos concedidos, fuentes que escriben datos en Health Connect, tipos de registros presentes y compatibilidad del dispositivo. La ausencia de datos no debe convertirse automáticamente en un valor clínico de cero.

La configuración local de CardioSync (`enabled`, `connectedAt` y `updatedAt`) describe el estado guardado por la aplicación; no debe confundirse con una prueba independiente de que los permisos sigan vigentes o de que haya ocurrido una sincronización exitosa.

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

