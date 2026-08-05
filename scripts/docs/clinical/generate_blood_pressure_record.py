from pathlib import Path


CONTENT = r"""
# BloodPressureRecord

Version: 1.0
Status: Draft
Phase: Clinical Knowledge Base

---

# 1. Objetivo

Definir BloodPressureRecord como entidad principal del dominio clínico de
CardioSync.

BloodPressureRecord representa el evento de registro de una medición de presión
arterial.

Es el núcleo del sistema.

---

# 2. Principio fundamental

CardioSync sigue el principio:

La medición existe antes que la interpretación.

Una medición registrada debe permanecer disponible independientemente de:

- la guía clínica seleccionada;
- el contexto disponible;
- el análisis generado.

---

# 3. Responsabilidad

BloodPressureRecord representa:

- qué se midió;
- cuándo se midió;
- qué valores fueron obtenidos.

No representa:

- clasificación clínica;
- diagnóstico;
- riesgo;
- recomendaciones.

---

# 4. Modelo conceptual

BloodPressureRecord

├── id

├── dateTime

├── systolic

├── diastolic

├── heartRate?

├── notes?

├── source

├── createdAt

└── updatedAt


---

# 5. Datos principales

## Systolic

Presión arterial sistólica.

Unidad:

mmHg.


---

## Diastolic

Presión arterial diastólica.

Unidad:

mmHg.


---

## DateTime

Momento exacto del registro.

Permite:

- análisis temporal;
- estadísticas;
- correlación con contexto.


---

# 6. Datos opcionales

Una medición puede incorporar:

- frecuencia cardíaca;
- notas;
- información técnica adicional.

Los datos complementarios no deben impedir el registro principal.

---

# 7. Relación con ClinicalContext

Modelo:

BloodPressureRecord

1

↓

0..1

ClinicalContext


La medición puede existir sin contexto.

El contexto puede agregarse posteriormente.

---

# 8. Relación con Statistics

Statistics utiliza múltiples BloodPressureRecord para generar:

- promedios;
- tendencias;
- variabilidad;
- evolución temporal.


---

# 9. Relación con ClinicalAnalysis

ClinicalAnalysis utiliza:

- BloodPressureRecord;
- ClinicalContext;
- ClinicalGuideline.


El análisis nunca modifica el registro original.

---

# 10. Origen del dato

Fuentes posibles:

- ingreso manual;
- importación;
- Health Connect;
- dispositivos futuros.


El origen debe conservarse como metadata.

---

# 11. Inmutabilidad clínica

Los valores originales de una medición deben conservarse.

Si existe una corrección:

debe quedar registrada como modificación del dato,

no como alteración silenciosa del histórico.

---

# 12. Decisiones arquitectónicas

## ADR-001

BloodPressureRecord es el núcleo del dominio.


## ADR-002

La interpretación clínica permanece separada del registro.


## ADR-003

Los datos externos se adaptan al dominio, no modifican el dominio.


---

# 13. Riesgos

Evitar:

- mezclar reglas clínicas;
- almacenar resultados interpretados;
- perder el valor original;
- depender de una única fuente de datos.


---

# 14. Impacto en CardioSync

Utilizado por:

- MeasurementForm;
- History;
- ClinicalChart;
- Statistics;
- ClinicalContext;
- ClinicalAnalysis.


---

# 15. Estado

Draft.

Pendiente:

- revisión final del modelo existente;
- alineación con implementación actual;
- validación contra exportaciones externas.


"""


def main():
    output = Path("docs/clinical/02_BLOOD_PRESSURE_RECORD.md")
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(CONTENT.strip() + "\n", encoding="utf-8")
    print(output)


if __name__ == "__main__":
    main()
