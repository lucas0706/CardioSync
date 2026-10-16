# Guía de uso de CardioSync

| Campo | Valor |
|---|---|
| Tipo | Guía funcional de usuario |
| Última revisión | 2026-10-15 |
| Plataforma | Android |
| Base documental | Rutas y pantallas de la rama `feature/app-updates` en el commit de referencia de la documentación |

Esta guía explica cómo está organizada la aplicación y para qué sirve cada área. Se basa en las rutas y pantallas del código; no es una prueba ejecutada en un dispositivo. Los textos, opciones y flujos pueden variar entre versiones.

## 1. Navegación principal

La navegación principal de producción tiene cuatro accesos:

| Sección | Para qué sirve |
|---|---|
| **Inicio** | Consultar el resumen cardiovascular y la última medición disponible. |
| **Registros** | Consultar el historial, aplicar filtros por período y abrir una medición. |
| **Perfil** | Mantener datos personales que aportan contexto al seguimiento. |
| **Más** | Acceder a reportes, estadísticas, configuración, información de la app y actualizaciones. |

Las secciones Reportes, Estadísticas y Configuración se abren desde Más; no aparecen como pestañas principales.

## 2. Inicio: resumen del seguimiento

La pantalla Inicio reúne información derivada de los registros. Si existen mediciones, muestra valores recientes de presión sistólica y diastólica y frecuencia cardíaca cuando está disponible, junto con la clasificación calculada para la medición más reciente. También contiene tarjetas de resumen y accesos a acciones relacionadas con el seguimiento.

Si todavía no hay registros, algunos valores pueden mostrarse vacíos o como no disponibles. Para empezar, se puede ir a **Registros** y crear una nueva medición.

La información de esta pantalla resume los datos almacenados; no sustituye una evaluación médica.

## 3. Registrar una medición

1. Abrir **Registros**.
2. Pulsar el botón de nueva medición.
3. Completar el formulario.
4. Revisar los datos y guardar.
5. Volver al historial y comprobar que el registro aparezca.

El formulario contempla presión sistólica y diastólica, fecha y hora, y datos opcionales o complementarios como frecuencia cardíaca, brazo utilizado, posición corporal y notas. La disponibilidad y obligatoriedad de cada campo se rigen por las validaciones del formulario.

La fecha y hora deben corresponder a la medición real. Si se carga un registro histórico, comprobar especialmente esos campos antes de guardarlo.

## 4. Consultar, filtrar y gestionar el historial

En **Registros** se muestran las mediciones guardadas, organizadas por fecha. El historial permite elegir períodos predefinidos, como hoy, últimos 7, 14, 30, 90, 180 o 365 días, períodos mensuales/anuales, todo el historial o un rango personalizado.

Al abrir una medición se accede a su detalle. Desde allí se puede entrar en modo edición o solicitar su eliminación. La eliminación de una medición individual requiere confirmación y no se puede deshacer desde ese flujo.

Antes de editar un registro histórico, comprobar los valores, la fecha, la hora y los datos de contexto para evitar alterar accidentalmente el registro.

## 5. Perfil

La sección **Perfil** permite guardar información personal que puede aportar contexto clínico, incluidos nombre, edad, sexo y datos corporales como altura y peso. La pantalla calcula el índice de masa corporal cuando dispone de altura y peso válidos.

Estos datos son información contextual y deben mantenerse actualizados. La presencia de un dato en el perfil no significa, por sí sola, que todas las reglas clínicas o reportes lo utilicen.

## 6. Estadísticas

Desde **Más → Estadísticas** se puede analizar la información registrada en diferentes períodos. Las estadísticas son una forma de observar patrones y tendencias de los datos; no deben interpretarse como un diagnóstico ni como una recomendación médica automática.

Los filtros de estadísticas son propios de esa función y no implican que el período seleccionado se aplique automáticamente al historial o a los reportes.

## 7. Crear y compartir un reporte

1. Abrir **Más → Reportes**.
2. Elegir un período predefinido o un rango personalizado.
3. Revisar los datos que se incluirán.
4. Abrir la vista previa.
5. Elegir la acción disponible: copiar el reporte, generar un PDF o compartir el PDF.

La pantalla de reportes impide iniciar la generación cuando no hay registros en el período elegido o cuando el rango personalizado está incompleto. La vista previa prepara el contenido del reporte y permite revisar el resultado antes de compartirlo.

Un reporte contiene información de salud. Antes de compartirlo, verificar el destinatario y el canal de envío. La información incluida depende de los registros y del contexto disponible en ese momento.

## 8. Configuración, importación y conexiones

En **Más → Configuración** se encuentran las opciones principales para gestionar los datos:

- **Importar mediciones:** iniciar la importación desde archivos compatibles.
- **Copias de seguridad:** crear una copia manual y acceder a las opciones de recuperación disponibles.
- **Copias programadas:** configurar la frecuencia y el horario de copias automáticas, con las autorizaciones que requiera Android.
- **Borrar todas las mediciones:** eliminar los registros almacenados. Es una acción destructiva; no ejecutarla sin comprender el alcance y contar con una copia recuperable si se desea conservar los datos.
- **Health Connect:** administrar la conexión y la exportación de mediciones de presión arterial hacia Health Connect.

La disponibilidad de los flujos externos depende de permisos, configuración del dispositivo y conexión con los servicios correspondientes.

## 9. Copias manuales y recuperación

En **Configuración → Copias de seguridad** se encuentran las acciones para generar una copia local, utilizar Google Drive cuando se ha iniciado sesión y restaurar una copia compatible desde un archivo seleccionado.

Antes de restaurar:

1. Confirmar que el archivo corresponde a una copia de CardioSync y que se eligió el archivo correcto.
2. Leer los mensajes de validación y confirmación de la aplicación.
3. Si los datos actuales son importantes, generar primero una copia independiente.
4. Después de restaurar, comprobar que el historial y las mediciones esperadas estén presentes.

No se debe dar por válida una copia únicamente porque exista un archivo: la recuperación solo queda comprobada cuando se ha restaurado correctamente y se verificaron los datos resultantes.

## 10. Copias programadas

En **Configuración → Copias programadas** se puede configurar la frecuencia, los días que correspondan y el horario. El sistema puede necesitar permisos de notificación, alarmas exactas o ajustes de optimización de batería, según el dispositivo y la configuración de Android.

Android puede limitar la ejecución en segundo plano. Revisar el estado y la fecha de la última ejecución que muestre la aplicación; no asumir que una programación configurada equivale a una copia completada.

## 11. Health Connect

Desde **Configuración → Health Connect** se puede intentar conectar CardioSync, solicitar los permisos requeridos, desactivar la conexión y gestionar las mediciones de presión arterial exportadas por CardioSync.

La integración no crea datos que no existan en Health Connect. Los permisos autorizan el acceso a tipos de datos, pero la información efectiva depende de las aplicaciones y dispositivos que los hayan registrado.

La opción de eliminar registros exportados por CardioSync afecta esos registros en Health Connect y debe usarse con cuidado. No es lo mismo que borrar el historial original de CardioSync.

## 12. Actualizaciones de la aplicación

Desde **Más → Actualizaciones** se puede consultar si hay una versión disponible. La pantalla también incluye una preferencia para habilitar o deshabilitar las actualizaciones OTA automáticas y un flujo de descarga, validación e inicio del instalador de Android para APK publicados en una release.

Cuando se instala un APK, Android muestra su propio instalador y puede solicitar autorización para instalar aplicaciones desde esa fuente. CardioSync no debe conceder ese permiso automáticamente. Revisar la versión indicada por la pantalla y no interrumpir el proceso hasta conocer su resultado.

Las actualizaciones OTA y las APK no son equivalentes. Una OTA solo es adecuada para cambios compatibles con el runtime nativo instalado; los cambios nativos requieren una nueva build.

## 13. Acerca de la aplicación

Desde **Más → Acerca de CardioSync** se accede a la información de la aplicación y a las novedades disponibles en esa pantalla.

## 14. Privacidad y cuidado de los datos

- La información registrada en CardioSync es información de salud y debe tratarse como sensible.
- Revisar los permisos antes de conectar Health Connect.
- Comprobar destinatarios antes de compartir reportes.
- Mantener copias de seguridad fuera del dispositivo cuando sea necesario y verificar que puedan restaurarse.
- No utilizar la aplicación como sustituto de una evaluación profesional ni retrasar la atención urgente por esperar un resultado de la app.

## 15. Documentación relacionada

- [Descripción funcional del producto](00_PRODUCT_OVERVIEW.md).
- [Reportes](07_REPORTS.md).
- [Health Connect](08_HEALTH_CONNECT.md).
- [Persistencia, importación y datos](09_DATABASE.md).
- [Versiones y actualizaciones](14_RELEASES_AND_UPDATES.md).
- [Arquitectura](01_ARCHITECTURE.md).

## Alcance de esta guía

La guía describe los flujos que se identifican en las rutas y pantallas del repositorio de referencia. No certifica que cada operación, permiso, tarea programada o restauración haya sido probada en todos los dispositivos Android. Los procedimientos sensibles —en especial restauración, borrado de datos y actualización del APK— deben validarse en la versión que se distribuya.
