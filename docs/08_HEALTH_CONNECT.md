# Integración con Health Connect

CardioSync integra Android Health Connect para acceder a datos de salud disponibles en el dispositivo y, en el caso de las mediciones de presión arterial, gestionar la exportación de registros de CardioSync. La integración está organizada en `src/features/healthConnect`.

## Qué aporta Health Connect

Health Connect funciona como una plataforma común de intercambio de datos de salud entre aplicaciones compatibles. CardioSync puede consultar los tipos de registros para los que solicita permisos y que realmente estén disponibles en Health Connect.

La integración documentada contempla estas categorías:

- Presión arterial.
- Frecuencia cardíaca.
- Pasos.
- Sueño.
- Ejercicio.
- Peso.
- Otros tipos de registros según la implementación y los permisos configurados.

La lista de tipos consultables o exportables depende del código de la versión instalada. Que una aplicación tenga permiso para leer un tipo de registro no significa que existan datos de ese tipo.

## Configuración y permisos

La pantalla de Health Connect permite administrar la conexión y las operaciones relacionadas con la exportación de mediciones. El usuario debe conceder los permisos en Android; CardioSync no puede garantizar que todos sean aceptados.

El estado guardado por CardioSync —por ejemplo, si la integración está habilitada o cuándo se registró una actualización— es información de configuración local. No demuestra por sí solo que los permisos sigan vigentes ni que una sincronización haya terminado correctamente.

## Componentes principales

| Componente | Función |
|---|---|
| `HealthConnectService` | Inicializa Health Connect y gestiona la solicitud de permisos para los tipos configurados. |
| `HealthConnectCoordinator` | Coordina lecturas de datos recientes disponibles en Health Connect. |
| `HealthConnectSettingsService` | Persiste la configuración local de la integración. |
| `HealthConnectSyncService` | Gestiona la exportación de mediciones de presión arterial de CardioSync y operaciones relacionadas con esos registros exportados. |
| `HealthConnectPagination` | Permite recorrer resultados paginados. |
| `HealthAggregateService` | Consulta datos agregados, como pasos del día y promedio de frecuencia cardíaca. |

Las lecturas descritas para frecuencia cardíaca, pasos, sueño, ejercicio y peso utilizan una ventana reciente de 30 días en la implementación documentada. El rango debe mantenerse sincronizado con el código si cambia.

## Flujo general

```text
Configuración de Health Connect
          ↓
Disponibilidad e inicialización
          ↓
Solicitud de permisos
          ↓
Lectura de registros autorizados
          ↓
Normalización y coordinación
          ↓
Datos disponibles para las funciones que los consumen
```

Para exportar presión arterial, el flujo es inverso: CardioSync toma sus propias mediciones y utiliza el servicio de sincronización para escribirlas en Health Connect según los permisos concedidos.

## Datos propios y externos

Las mediciones guardadas en CardioSync y los registros que provienen de otras aplicaciones son fuentes distintas. La integración externa complementa el seguimiento; no debe interpretarse como sustituto del historial propio de CardioSync.

Las funciones de eliminación relacionadas con la sincronización deben utilizarse con cuidado: se refieren a registros asociados a la exportación de CardioSync y no equivalen a borrar todo el contenido de Health Connect. Antes de modificar este flujo, comprobar cómo se identifican los registros que pertenecen a CardioSync.

## Ausencia de datos

Si Health Connect no tiene registros de un tipo, o si el usuario no concede el permiso correspondiente, ese dato no está disponible para CardioSync. La ausencia de un registro no debe convertirse automáticamente en un valor de cero ni impedir el uso de las funciones que trabajan con mediciones propias.

## Archivos relacionados

- `src/features/healthConnect/`
- `src/features/healthConnect/services/`
- `src/features/healthConnect/mappers/`
- `src/features/healthConnect/types/`
- [Guía de uso](15_USER_GUIDE.md)
- [Dominio clínico](04_CLINICAL_DOMAIN.md)
- [Base de datos e importación](09_DATABASE.md)

## Uso responsable

Health Connect facilita el intercambio de datos, pero no garantiza que estén completos, actualizados o disponibles en todos los dispositivos. Las interpretaciones clínicas deben basarse en datos identificables y en reglas clínicas documentadas.