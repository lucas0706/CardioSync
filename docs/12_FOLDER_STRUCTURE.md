
# CardioSync — Folder Structure

| Campo | Valor |
|-------|--------|
| Documento | 12_FOLDER_STRUCTURE.md |
| Tipo | Organización del repositorio |
| Estado | Activo |
| Versión | Sincronizada con la versión del proyecto |
| Última actualización | 2026-08-03 |

---

# Objetivo

Este documento define la estructura oficial del repositorio CardioSync.

Su finalidad es:

- Mantener una organización consistente.
- Evitar duplicación de responsabilidades.
- Facilitar mantenimiento.
- Mantener una arquitectura escalable.

---

# Estructura general

CardioSync/

- src/
- docs/
- assets/
- package.json
- tsconfig.json

---

# Directorio src

El código fuente principal se encuentra dentro de:

src/

La estructura interna deberá respetar separación por responsabilidades.

---

# Estructura principal

src/

- components/
- features/
- domain/
- services/
- hooks/
- store/
- theme/
- utils/
- types/

---

# components

Responsabilidad:

Componentes reutilizables de interfaz.

Incluye:

- Botones.
- Inputs.
- Cards.
- Elementos visuales comunes.

No incluye:

- Lógica clínica.
- Lógica de negocio.
- Acceso directo a datos.

---

# features

Responsabilidad:

Módulos funcionales de la aplicación.

Ejemplo:

features/

- measurements/
- statistics/
- dashboard/
- clinical/

Cada feature debe mantener sus responsabilidades dentro de su propio dominio.



---

# domain

Responsabilidad:

Modelos principales del negocio.

Incluye:

- Entidades.
- Interfaces.
- Tipos propios del dominio.

No depende de:

- React.
- Componentes visuales.
- SQLite.
- Servicios externos.

---

# services

Responsabilidad:

Integraciones y servicios compartidos.

Ejemplos futuros:

- Health Connect.
- Importación de datos.
- Exportación.
- Servicios externos.

---

# hooks

Responsabilidad:

Lógica reutilizable relacionada con comportamiento de interfaz.

No contiene:

- Reglas clínicas.
- Modelos de negocio.
- Persistencia directa.

---

# store

Responsabilidad:

Gestionar estado global de la aplicación cuando sea necesario.

Debe evitar almacenar lógica de dominio.

---

# theme

Responsabilidad:

Sistema visual centralizado.

Incluye:

- Colores.
- Tipografía.
- Espaciados.
- Tokens visuales.

---

# utils

Responsabilidad:

Funciones auxiliares reutilizables.

No contiene:

- Lógica clínica.
- Reglas de negocio.
- Acceso a datos.

---

# types

Responsabilidad:

Tipos compartidos utilizados por distintos módulos.

---

# docs

Responsabilidad:

Documentación oficial del proyecto.

Archivos principales:

- 00_PROJECT_MASTER_CONTEXT.md
- 01_ARCHITECTURE.md
- 02_ROADMAP.md
- 03_DECISIONS.md
- 04_CLINICAL_DOMAIN.md
- 05_CLINICAL_RULE_ENGINE.md
- 06_CLINICAL_ANALYSIS.md
- 07_REPORTS.md
- 08_HEALTH_CONNECT.md
- 09_DATABASE.md
- 10_CHANGELOG.md
- 11_MODULES.md
- 12_FOLDER_STRUCTURE.md

---

# Reglas para nuevos archivos

Antes de crear un archivo nuevo:

1. Identificar la responsabilidad.
2. Ubicarlo dentro del módulo correcto.
3. Evitar duplicación de funcionalidades.
4. Mantener separación entre capas.
5. Actualizar documentación si cambia la arquitectura.

---

# Restricciones

No crear:

- Lógica clínica dentro de components.
- Acceso a SQLite dentro de UI.
- Modelos de dominio dentro de componentes visuales.
- Datos externos dentro de entidades principales.
- Reglas clínicas dentro de Statistics.

---

# Evolución de estructura

La estructura del repositorio podrá evolucionar, pero cualquier cambio arquitectónico deberá registrarse en:

- 01_ARCHITECTURE.md
- 03_DECISIONS.md
- 10_CHANGELOG.md

