from pathlib import Path


CONTENT = r"""
# AlertEngine

Version: 1.0
Status: Draft
Phase: Clinical Knowledge Base

---

# 1. Objetivo

Definir el dominio AlertEngine dentro de CardioSync.

AlertEngine representa el componente encargado de identificar situaciones que
requieren una advertencia al usuario basándose en datos registrados y análisis
clínicos disponibles.

No realiza diagnósticos.

No reemplaza una evaluación médica.

No modifica datos registrados.

---

# 2. Principio fundamental

Una alerta es un mecanismo de comunicación de información relevante.

No es un diagnóstico.

No es una recomendación terapéutica.

No es una decisión médica autónoma.

---

# 3. Separación de responsabilidades

## BloodPressureRecord

Registra:

- valores obtenidos;
- fecha;
- hora.


## ClinicalContext

Aporta:

- información complementaria;
- circunstancias clínicas.


## ClinicalAnalysis

Interpreta:

- medición;
- contexto;
- guía seleccionada.


## AlertEngine

Comunica:

- situaciones relevantes;
- necesidad de atención;
- datos inconsistentes.


---

# 4. Flujo conceptual

BloodPressureRecord

+

ClinicalContext

+

ClinicalAnalysis

↓

AlertEngine

↓

Alert


---

# 5. Modelo conceptual

Alert

├── id

├── type

├── severity

├── message

├── source

├── createdAt

└── status


---

# 6. Tipos de alertas

Ejemplos conceptuales:

## MeasurementAlert

Relacionada con:

- valores extremos;
- medición incompleta;
- datos inconsistentes.


---

## ContextAlert

Relacionada con:

- ausencia de información relevante;
- datos desactualizados;
- baja calidad contextual.


---

## ClinicalAlert

Relacionada con hallazgos derivados del análisis clínico.


---

# 7. Severidad

La severidad debe ser independiente del texto mostrado.

Modelo conceptual:

- information;
- warning;
- urgent.


La interpretación final dependerá de las reglas definidas.

---

# 8. Trazabilidad

Toda alerta debe poder responder:

- qué dato la generó;
- qué análisis la originó;
- qué guía estaba activa;
- cuándo fue creada.


---

# 9. Integración con ClinicalAnalysis

AlertEngine consume resultados.

No contiene reglas clínicas de clasificación.

Flujo:

ClinicalAnalysis

↓

AlertEngine

↓

Alert


---

# 10. Integración futura

Puede utilizar información proveniente de:

- ClinicalContextBuilder;
- ContextQualityEngine;
- ClinicalAnalysisEngine.


---

# 11. Decisiones arquitectónicas

## ADR-036

Las alertas serán entidades independientes.


## ADR-037

AlertEngine no realizará diagnóstico.


## ADR-038

Toda alerta debe mantener trazabilidad hacia su origen.


---

# 12. Riesgos

Evitar:

- exceso de alertas;
- mensajes ambiguos;
- alertas sin fuente;
- confundir advertencia con recomendación médica.


---

# 13. Impacto en CardioSync

Utilizado por:

- Dashboard;
- ClinicalAnalysis;
- ContextAssistant;
- notificaciones futuras.


---

# 14. Estado

Draft.

Pendiente:

- definición de reglas clínicas;
- integración con ClinicalAnalysisEngine;
- validación de experiencia de usuario.


"""


def main():
    output = Path("docs/clinical/12_ALERT_ENGINE.md")
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(CONTENT.strip() + "\n", encoding="utf-8")
    print(output)


if __name__ == "__main__":
    main()
