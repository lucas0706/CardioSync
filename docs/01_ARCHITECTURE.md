# CardioSync — Architecture

| Campo | Valor |
|-------|--------|
| Documento | 01_ARCHITECTURE.md |
| Tipo | Especificación de Arquitectura |
| Estado | Activo |
| Versión | Sincronizada con la versión del proyecto |
| Última actualización | 2026-08-03 |

---

# 1. Objetivo

Este documento describe la arquitectura técnica de CardioSync.

Su finalidad es documentar la organización del sistema, las responsabilidades de cada módulo y las relaciones entre ellos.

No describe funcionalidades de usuario.

No reemplaza al código fuente.

Describe la arquitectura que gobierna el proyecto.

---

# 2. Principios arquitectónicos

La arquitectura de CardioSync se basa en los siguientes principios:

- Separación de responsabilidades.
- Bajo acoplamiento.
- Alta cohesión.
- Arquitectura modular.
- Reutilización.
- Escalabilidad.
- Evolución incremental.
- Dominio independiente de la interfaz.
- Persistencia encapsulada.
- Documentación sincronizada con el código.

---

# 3. Arquitectura general

La arquitectura del proyecto se organiza mediante capas claramente diferenciadas.

Presentación

↓

Features

↓

Domain

↓

Core

La capa Clinical consume información del dominio sin acoplarse a la interfaz.

Toda comunicación entre módulos deberá respetar esta organización.

---

# 4. Capas principales

## Core

Responsabilidad:

Infraestructura compartida.

Incluye persistencia, configuración y servicios comunes.

---

## Domain

Responsabilidad:

Modelar el dominio del negocio.

Contiene entidades, modelos y lógica independiente de la interfaz.

---

## Features

Responsabilidad:

Implementar funcionalidades organizadas por módulos.

Cada feature deberá ser autocontenida siempre que sea posible.

---

## Clinical

Responsabilidad:

Implementar la lógica clínica basada en guías clínicas.

No implementa componentes de interfaz.

No realiza persistencia.

---

## Components

Responsabilidad:

Componentes reutilizables de presentación.

No contienen lógica de negocio.



---

# 13. Dominio de Measurements

## Estado

✅ IMPLEMENTADO

El dominio Measurements constituye el núcleo funcional del proyecto.

Responsabilidades:

- Registrar mediciones.
- Validar datos.
- Gestionar el historial.
- Persistir información.

No implementa interpretación clínica.

---

# 14. Dominio Statistics

## Estado

✅ IMPLEMENTADO

El motor Statistics procesa matemáticamente las mediciones registradas.

Responsabilidades:

- Estadísticas descriptivas.
- Tendencias.
- Promedios.
- Variabilidad.
- Indicadores.

No interpreta resultados clínicos.

No genera recomendaciones.

---

# 15. Dominio Clinical

## Estado

🚧 EN DESARROLLO

El dominio Clinical será responsable de la interpretación de las mediciones utilizando exclusivamente reglas derivadas de guías clínicas oficialmente soportadas.

Su evolución contempla:

- ClinicalContext
- ClinicalRuleEngine
- ClinicalAnalysisEngine

No realizará persistencia.

No implementará componentes React.

---

# 16. Persistencia

## Estado

✅ IMPLEMENTADO

La persistencia del proyecto utiliza SQLite.

Toda operación sobre la base de datos deberá realizarse mediante la capa Repository.

La arquitectura prohíbe el acceso directo a SQLite desde la interfaz.

---

# 17. Escalabilidad

La arquitectura ha sido diseñada para permitir la incorporación de nuevos módulos sin modificar la estructura principal del sistema.

Las futuras funcionalidades deberán integrarse respetando la separación entre:

- Presentación.
- Dominio.
- Persistencia.
- Interpretación clínica.



---

# 18. Restricciones arquitectónicas

Las siguientes restricciones constituyen reglas obligatorias del proyecto.

## Separación de responsabilidades

- La UI no implementa lógica de negocio.
- El dominio no depende de React.
- Clinical no depende de la interfaz.
- Statistics no implementa reglas clínicas.
- Dashboard únicamente presenta información.

---

## Persistencia

- Todo acceso a SQLite deberá realizarse mediante Repository.
- Ningún componente React accederá directamente a la base de datos.

---

## Dominio

- Cada entidad deberá representar una única responsabilidad.
- El dominio deberá permanecer independiente de la infraestructura.

---

## Clinical

- Toda interpretación clínica deberá derivarse exclusivamente de guías clínicas oficialmente soportadas.
- Toda regla deberá ser trazable hasta su fuente.
- No existirán recomendaciones sin respaldo documental.

---

# 19. Evolución arquitectónica

La evolución del proyecto seguirá el siguiente orden:

Arquitectura Base

↓

Measurements

↓

Statistics

↓

Dashboard

↓

Clinical Foundation

↓

Clinical Domain

↓

Clinical Rule Engine

↓

Clinical Analysis Engine

↓

Health Connect

↓

Clinical Reports

Cada nueva fase deberá preservar la compatibilidad con la arquitectura existente.

---

# 20. Conclusión

La arquitectura de CardioSync prioriza:

- Mantenibilidad.
- Modularidad.
- Escalabilidad.
- Bajo acoplamiento.
- Alta cohesión.
- Separación estricta de responsabilidades.

Toda evolución futura deberá respetar estos principios para garantizar la estabilidad y el crecimiento sostenido del proyecto.

