# CardioSync — Base de datos, importación y persistencia

| Campo | Valor |
|---|---|
| Documento | 09_DATABASE.md |
| Tipo | Referencia de persistencia e intercambio |
| Estado | Implementación presente; esquema completo y flujos requieren validación adicional |
| Última revisión documental | 2026-10-15 |
| Rama de referencia | `docs/documentation-audit`, basada en `feature/app-updates` |

## 1. Persistencia local

CardioSync utiliza SQLite para almacenar información local. El código de restauración reconoce el archivo `cardiosync.db` y valida la presencia de las tablas `blood_pressure_records` y `clinical_profile` antes de aceptar una copia como base CardioSync.

Esta referencia no reemplaza la definición de esquema ni un inventario de migraciones. Los nombres anteriores se citan porque aparecen en la validación de restauración; no implican que sean las únicas tablas de la base.

Las operaciones de persistencia deben permanecer encapsuladas en la capa de base de datos y repositorios. La UI no debe ejecutar consultas SQLite directamente.

## 2. Copia y restauración

La copia de seguridad y la restauración se documentan por separado en [Copias de seguridad y recuperación](16_BACKUP_AND_RESTORE.md).

Aspectos importantes del comportamiento documentado en el código:

- La restauración valida `PRAGMA integrity_check`.
- Comprueba la existencia de `blood_pressure_records` y `clinical_profile`.
- Lee la cantidad de mediciones antes de aceptar la base.
- La restauración reemplaza la base local; no debe tratarse como una combinación de historiales.
- Una copia de CardioSync y una importación de mediciones externas son flujos diferentes.

Los escenarios de recuperación deben probarse en dispositivo antes de declarar el proceso verificado.

## 3. Importación de históricos

La rama auditada contiene dos parsers de importación:

### CSV de CardioSync

El parser espera las siguientes columnas con esos encabezados:

- `Fecha`
- `Sistólica`
- `Diastólica`
- `Pulso`
- `Sitio`
- `Posición`
- `Nota`

El parser normaliza los registros, identifica duplicados y reporta errores de registros. La compatibilidad real depende de que el archivo respete el formato esperado; no debe asumirse que cualquier CSV es compatible.

### Base SQLite externa

El parser busca una tabla llamada `tranx` con estas columnas requeridas:

- `sys`
- `dia`
- `pulse`
- `siteId`
- `positionID`
- `note`
- `tranxDate`
- `tranxTime`

La importación convierte esos campos al modelo interno y procesa duplicados. Este formato es una estructura externa concreta; no significa que cualquier archivo SQLite pueda importarse.

### Formatos no confirmados

No se debe anunciar compatibilidad con Excel/XLS/XLSX basándose en esta implementación. En la rama auditada se encontraron parsers CSV y SQLite, pero no un parser XLS/XLSX en este flujo.

## 4. Flujo de importación

El flujo general implementado se organiza así:

Archivo seleccionado → parser específico → normalización y validación → vista previa/resultado → persistencia de mediciones.

Los servicios de selección de archivos utilizan el selector del sistema y una copia temporal para procesar la base SQLite externa. La persistencia final debe revisarse junto con el servicio de importación y sus pruebas cuando se modifique este flujo.

## 5. Exportación y reportes

La generación de reportes PDF está documentada en [Reportes](07_REPORTS.md). No debe confundirse un PDF de reporte con una exportación completa de la base de datos.

Antes de afirmar que existe un formato de exportación de datos, debe verificarse el flujo específico de exportación, su estructura y su comportamiento con datos reales. La documentación no declara Excel como formato soportado sin una implementación comprobada.

## 6. Reglas para cambios futuros

Cuando cambie el esquema o la importación:

1. Documentar las tablas, columnas, tipos, restricciones y migraciones reales.
2. Mantener el modelo interno independiente de los formatos externos.
3. Validar los datos antes de persistirlos.
4. Registrar cómo se detectan y presentan los duplicados y errores.
5. Aclarar si el flujo reemplaza, agrega o combina datos.
6. Añadir o actualizar pruebas antes de declarar el comportamiento verificado.
7. Actualizar esta guía y la de copias/restauración cuando corresponda.

## 7. Límites de esta referencia

Este documento se basa en una inspección estática de los parsers CSV/SQLite y del servicio de validación de restauración de la rama documental. No se ejecutaron compilaciones, pruebas automatizadas ni pruebas en dispositivo durante esta revisión. La auditoría no certifica la integridad de todos los escenarios de importación o recuperación.
