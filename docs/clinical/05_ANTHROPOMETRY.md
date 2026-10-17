# Antropometría

**Estado:** documentación contrastada con el código de `feature/app-updates` el 17-10-2026.

## 1. Datos disponibles

La implementación actual mantiene `height`, `weight` y `bmi` como campos opcionales de `ClinicalContext`, usado por el perfil clínico local. También existen campos reservados `weight`, `height` y `bmi` en `BloodPressureRecord` por compatibilidad; no deben interpretarse como la arquitectura final deseada.

La pantalla de perfil presenta altura en centímetros y peso inicial en kilogramos. El IMC se calcula automáticamente cuando ambos valores son positivos.

## 2. Cálculo del IMC

La pantalla convierte la altura de centímetros a metros y calcula:

`IMC = peso (kg) / altura (m)²`

El resultado se redondea a un decimal. Si falta la altura o el peso, o alguno no es positivo, el IMC queda sin valor.

## 3. Límites actuales

- No hay un modelo de dominio independiente `Anthropometry`.
- El peso del perfil es el peso inicial/de referencia, no una serie de pesos longitudinales.
- La integración futura de peso actual desde Health Connect no significa que ese dato se combine hoy con el perfil para el análisis clínico.
- No se debe inferir obesidad ni generar diagnóstico automáticamente a partir del IMC.

## 4. Mantenimiento

Si se separa la antropometría del perfil, deberá hacerse con una decisión arquitectónica y una migración compatible con los datos guardados. Hasta entonces, `ClinicalContext` es el contrato vigente para los datos antropométricos del perfil.