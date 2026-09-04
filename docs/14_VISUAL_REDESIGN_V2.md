# CardioSync — Visual Redesign V2

**Estado:** ✅ IMPLEMENTADO
**Fecha de diseño:** 2026-08-13
**Fecha de implementación:** 2026-08-22
**Base:** estado funcional existente de CardioSync

---

## 1. Objetivo

El Rediseño Visual V2 evolucionó la interfaz de CardioSync hacia una experiencia de aplicación de salud moderna, clara y clínicamente legible, manteniendo las funcionalidades y la arquitectura existentes.

La implementación se realizó de forma incremental sobre la aplicación funcional existente, priorizando la reutilización de componentes, la consistencia visual y la conservación de la lógica de dominio.

El rediseño prioriza:

- jerarquía visual;
- legibilidad;
- reducción de densidad visual;
- consistencia entre pantallas;
- identidad visual coherente;
- mejor presentación de información clínica;
- navegación simplificada;
- reutilización de componentes;
- compatibilidad con la arquitectura existente.

El rediseño no implicó una reimplementación del dominio funcional.

Las modificaciones realizadas se concentraron principalmente en la interfaz, composición de pantallas, jerarquía visual, componentes reutilizables, navegación y presentación de la información.

---

## 2. Principio fundamental

La funcionalidad existente fue utilizada como fuente de verdad durante todo el rediseño.

El rediseño modifica principalmente:

- presentación;
- jerarquía;
- composición;
- navegación;
- componentes visuales;
- estilos;
- densidad de información;
- interacción visual.

Durante la implementación se evitó modificar innecesariamente:

- modelos de dominio;
- cálculos estadísticos;
- reglas clínicas;
- persistencia;
- servicios;
- importación;
- generación de reportes;
- lógica funcional ya estable;
- contratos existentes entre capas.

---

## 3. Estrategia de dependencias

Se priorizó el uso de las dependencias existentes.

No se incorporaron dependencias adicionales únicamente por razones estéticas menores.

Especialmente:

- `victory-native`
- `@shopify/react-native-skia`
- `react-native-svg`

Si una necesidad visual concreta no puede resolverse razonablemente con las dependencias actuales, se podrá evaluar una nueva dependencia.

Toda nueva dependencia deberá verificarse antes de incorporarse respecto de:

- Expo SDK 57;
- React Native;
- TypeScript strict;
- compatibilidad con dependencias existentes;
- Android;
- estabilidad y mantenimiento;
- impacto sobre bundle y arquitectura.

No se agregan dependencias únicamente por razones estéticas menores.

---

## 4. Navegación principal

La navegación inferior implementada quedó definida como:

`Inicio | Registros | Perfil | Más`

### 4.1 Inicio

Dashboard principal de CardioSync.

La pantalla fue reorganizada para priorizar la última medición y reducir elementos secundarios.

### 4.2 Registros

Historial de mediciones.

La pantalla utiliza tarjetas compactas orientadas a la lectura rápida de los registros.

### 4.3 Perfil

Información personal y clínica del usuario.

La configuración de la aplicación y las integraciones no forman parte del Perfil.

### 4.4 Más

Funciones secundarias, análisis y acceso a Configuración.

---

## 5. Acción rápida

El botón flotante `+` representa:

**Nueva medición**

Durante el rediseño se consolidó como la acción rápida principal para crear una medición.

Debe aparecer en:

- Inicio;
- Registros.

No debe aparecer en pantallas donde no tenga sentido.

No se agregará otro bloque de "Nueva medición" dentro de Inicio porque el FAB ya cumple esa función.

---

# 6. Inicio / Dashboard

## 6.1 Estructura implementada

La pantalla contiene:

1. saludo;
2. nombre del usuario;
3. selector/botón de fecha;
4. última medición;
5. resumen semanal.

No se muestra un gráfico directamente en Inicio.

No se agregó una sección de accesos rápidos.

También se eliminó el botón secundario **“Ver registros”** que aparecía debajo del resumen semanal. El acceso a Registros queda delegado a la navegación inferior.

## 6.2 Última medición

La última medición constituye el elemento visual dominante de Inicio.

Muestra cuatro bloques principales:

- PAS;
- PAD;
- FC;
- clasificación.

Los valores clínicos tienen mayor jerarquía visual que los datos secundarios.

Los datos secundarios incluyen:

- fecha/hora;
- brazo;
- posición.

La clasificación utiliza el sistema semántico definido por `BloodPressureClassifier`.

El indicador visual de clasificación utiliza un punto de color junto al texto. En la versión final implementada, este punto funciona como un pequeño indicador luminoso con animación de destello utilizando el color correspondiente a la clasificación.

Esto permite reconocer visualmente el estado de la última medición sin agregar elementos clínicos adicionales.

## 6.3 Resumen semanal

Se mantiene como sección secundaria de Inicio.

Las métricas se presentan de forma compacta respecto de la última medición.

El resumen no contiene un acceso adicional a Registros, ya que esa navegación se realiza mediante la barra inferior.

## 6.2 Última medición

La última medición será el elemento visual dominante de Inicio.

Debe mostrar cuatro bloques:

- PAS;
- PAD;
- FC;
- clasificación.

Los valores clínicos tendrán mayor jerarquía visual que los datos secundarios.

Los datos secundarios incluyen:

- fecha/hora;
- brazo;
- posición.

## 6.3 Resumen semanal

Se mantiene.

Debe presentar las métricas de forma compacta y secundaria respecto de la última medición.

---

# 7. Registros / History

La función principal es permitir recorrer rápidamente las mediciones.

La pantalla fue implementada con una presentación compacta, priorizando la lectura rápida y evitando acciones permanentes que aumenten la densidad visual.

Las tarjetas deberán ser compactas, idealmente de dos líneas.

Formato conceptual:

`124/80 mmHg                         ● Límite`

`FC 85 · 10:33 · Izquierdo · Sentado       ›`

## 7.1 Primera línea

Contiene:

- presión sistólica/diastólica;
- unidad;
- clasificación;
- color semántico correspondiente.

La clasificación se presenta mediante un indicador visual de color y texto, manteniendo la semántica definida por el dominio clínico.

## 7.2 Segunda línea

Contiene, cuando exista:

- frecuencia cardíaca;
- hora;
- brazo;
- posición.

La información secundaria se mantiene en una segunda línea para conservar las tarjetas compactas y facilitar el recorrido visual del historial.

## 7.3 Alerta clínica

La alerta clínica NO se muestra en el listado de History.

Solo se muestra al abrir el detalle de la medición.

Esto evita que el historial se convierta en una pantalla visualmente sobrecargada y mantiene la información clínica contextual dentro del detalle.

## 7.4 Acciones

Tocar una medición abre su detalle.

No se muestran permanentemente botones Editar/Eliminar en cada tarjeta.

El FAB `+` permite crear una nueva medición.

De esta forma, las acciones secundarias permanecen disponibles sin ocupar espacio visual permanente en cada registro.

---

# 8. Detalle de medición

El detalle permite comprender completamente una medición y ejecutar sus acciones.

La presentación mantiene una jerarquía clínica clara y separa la información principal de los datos secundarios.

Orden conceptual:

1. presión arterial;
2. clasificación;
3. frecuencia cardíaca;
4. alerta clínica;
5. información de medición;
6. notas, solo si existen;
7. Editar;
8. Eliminar.

## 8.1 Presión

`PAS / PAD` es el elemento dominante del detalle.

La presión arterial recibe la mayor jerarquía visual.

## 8.2 Clasificación

Se muestra debajo de la presión con:

- nombre completo;
- color semántico correspondiente.

Se utiliza la clasificación proveniente del dominio clínico, evitando duplicar las reglas de clasificación dentro de la interfaz.

## 8.3 Frecuencia cardíaca

Utiliza una card independiente para mantener la frecuencia cardíaca diferenciada de la presión arterial.

## 8.4 Alerta clínica

Aparece debajo de la frecuencia cardíaca cuando corresponde.

La alerta conserva su función clínica y no se utiliza como elemento decorativo.

## 8.5 Información

Mostrar solamente datos existentes:

- fecha;
- hora;
- brazo;
- posición.

## 8.6 Notas

Si no existen notas, la sección se oculta.

Esto evita reservar espacio para información ausente.

## 8.7 Acciones

Se mantienen dos acciones independientes:

- Editar medición;
- Eliminar medición.

La eliminación conserva la confirmación antes de ejecutar la operación.

---

# 9. Nueva medición / Measurement

La pantalla prioriza la introducción rápida de una medición.

El rediseño mantiene el flujo funcional existente y concentra la jerarquía visual en los valores de presión arterial y frecuencia cardíaca.

## 9.1 Bloque principal

PAS, PAD y FC están dentro del mismo bloque.

Los tres mantienen una jerarquía visual equivalente.

Conceptualmente:

`PAS | PAD | FC`

El botón Guardar es ancho y de altura moderada.

En la implementación final, el botón de Guardar utiliza el verde definido para la acción de guardado, diferenciándolo visualmente de las acciones secundarias.

## 9.2 Detalles

Se utilizan filas compactas para:

- fecha y hora;
- brazo;
- posición.

Esto permite reducir la altura total del formulario sin eliminar información disponible.

## 9.3 Notas

Notas se presenta como un campo secundario que permite agregar contenido.

No se convierte en el elemento visual principal del formulario.

## 9.4 Foco inicial

La interacción inicial facilita la carga de:

`PAS → PAD → FC`

El objetivo es que el usuario pueda registrar los valores clínicos principales con el menor número posible de acciones.

---

# 10. Estadísticas

Las estadísticas existentes se mantienen.

No se eliminaron métricas existentes.

La pantalla fue reorganizada visualmente para mejorar la lectura y separar el resumen de los análisis más detallados.

Orden conceptual:

1. selector de período;
2. resumen principal;
3. gráfico;
4. variabilidad;
5. otros indicadores;
6. clasificación;
7. distribución clínica.

## 10.1 Selector

Se mantienen los períodos:

- 7 días;
- 30 días;
- 90 días;
- personalizado.

El selector permite cambiar el período analizado sin modificar la lógica de cálculo estadístico.

## 10.2 Gráfico

PAS, PAD y FC permanecen en el mismo gráfico.

Se mantienen las funcionalidades de:

- zoom;
- desplazamiento;
- selección de series;
- interacción.

El gráfico permanece exclusivamente en Estadísticas y no se incorpora al Dashboard de Inicio.

## 10.3 Rediseño del ClinicalChart

El ClinicalChart fue integrado al rediseño visual de Estadísticas.

Se mantuvo la funcionalidad existente y se trabajó principalmente sobre su presentación visual.

Objetivos:

- líneas más finas;
- marcadores más discretos;
- grid sutil;
- ejes más limpios;
- mejor jerarquía;
- leyenda integrada;
- mayor sensación de producto clínico;
- menor apariencia de gráfico genérico.

Primero se intentará alcanzar este resultado utilizando las dependencias actuales.

---

# 11. Reportes

El sistema de Reportes fue consolidado como una funcionalidad independiente del rediseño general.

El contenido del reporte permanece estandarizado y no se ofrece al usuario una selección individual de contenidos.

El usuario selecciona el período, pero no selecciona individualmente qué contenidos incluir.

Estructura:

1. título/descripción;
2. período seleccionado;
3. contenido del reporte;
4. resumen;
5. generación y posibilidad de compartir el PDF.

El contenido se mantiene estandarizado.

El reporte utiliza una implementación HTML que posteriormente se convierte en PDF mediante `expo-print`.

La generación del archivo utiliza un nombre descriptivo que incorpora información del período y la fecha/hora de generación.

El botón principal mantiene una presentación amplia y moderada, coherente con el sistema visual del resto de la aplicación.

---

# 12. Perfil

La barra inferior muestra:

`Perfil`

y no:

`Configuración`

La separación entre Perfil y Configuración quedó consolidada durante la implementación del rediseño.

Perfil concentra la información personal y clínica del usuario, mientras que las funciones de configuración de la aplicación permanecen en `Más → Configuración`.

La pantalla Perfil funciona como entrada a categorías de información.

Estructura:

- Datos básicos;
- Datos antropométricos;
- Factores de riesgo;
- Antecedentes cardiovasculares;
- Datos automáticos.

No se pretende mostrar todos los campos en una única pantalla extensa.

Cada categoría puede abrir su formulario correspondiente.

---

# 13. Datos básicos

Los datos básicos del usuario se mantienen dentro del área de Perfil.

La organización visual busca evitar una pantalla única excesivamente extensa y separar conceptualmente las distintas categorías de información.

---

# 14. Datos antropométricos

Los datos antropométricos permanecen separados conceptualmente de los datos básicos.

El rediseño no introduce clasificaciones clínicas nuevas ni modifica los cálculos existentes.

---

# 15. Factores de riesgo

Los factores de riesgo se mantienen agrupados dentro del área de Perfil.

La interfaz utiliza controles compactos y claros para evitar formularios visualmente densos.

---

# 16. Antecedentes cardiovasculares

Los antecedentes cardiovasculares siguen el mismo criterio visual que los factores de riesgo.

La información permanece agrupada y utiliza controles compactos.

---

# 17. Datos automáticos

Perfil puede representar información que pueda provenir de integraciones automáticas.

La gestión de conexiones, permisos y sincronización pertenece a Configuración y no al Perfil.

---

# 18. Más

La navegación Más quedó organizada para concentrar las funciones secundarias y evitar sobrecargar la barra inferior.

## Análisis

- Estadísticas;
- Reportes.

## Configuración

- Configuración.

La barra inferior no muestra Estadísticas ni Reportes directamente.

## Análisis

- Estadísticas;
- Reportes.

## Configuración

- Configuración.

La barra inferior no muestra Estadísticas ni Reportes directamente.

---

# 19. Configuración

Configuración administra funciones de la aplicación e integraciones.

La sección quedó separada conceptualmente del Perfil y concentra las operaciones de aplicación, importación/exportación e integraciones.

Debe contener:

## Datos

- Importar;
- Exportar.

## Integraciones

- Health Connect.

## Herramientas de desarrollador

Al final de la pantalla y claramente separadas del uso normal.

Aquí permanecerán las herramientas/tests existentes.

Ejemplos actuales:

- Clinical Test;
- Report Test;
- otros tests de desarrollo.

Estas herramientas no deben mezclarse visualmente con las funciones normales de usuario.

---

# 20. Health Connect

La gestión de Health Connect pertenece conceptualmente a:

`Más → Configuración → Health Connect`

No pertenece al Perfil.

Perfil puede mostrar datos provenientes de una integración, mientras que la gestión de conexión, permisos y sincronización corresponde a Configuración.

Esta separación mantiene diferenciadas la información personal del usuario y la administración técnica de las integraciones.

---

# 21. Design System

El sistema visual fue consolidado durante el rediseño mediante los componentes reutilizables y el theme centralizado.

## 21.1 Identidad

Se mantiene azul como color principal.

El azul representa:

- acciones principales;
- navegación activa;
- identidad de CardioSync.

## 21.2 Colores semánticos

Verde:

- estados positivos;
- éxito;
- acciones exitosas.

Ámbar:

- advertencias;
- estados clínicos intermedios.

Rojo:

- estados clínicos de mayor severidad;
- acciones destructivas;
- errores.

Los colores clínicos no deben utilizarse como decoración general.

## 21.3 Fondo y superficies

Base:

- fondo muy claro;
- superficies blancas;
- bordes sutiles.

## 21.4 Tipografía

La dirección visual mantiene una tipografía limpia y orientada a legibilidad.

La jerarquía se organiza mediante:

- títulos;
- subtítulos;
- valores clínicos;
- cuerpo;
- captions;
- textos auxiliares.

La tipografía no debe utilizarse para introducir una dependencia innecesaria si el resultado puede obtenerse con la configuración existente.

## 21.5 Cards

Cards con:

- esquinas redondeadas;
- sombras sutiles;
- padding consistente;
- jerarquía clara.

No todo debe ser una card.

Filas compactas se utilizarán cuando sean más apropiadas.

## 21.6 Botones

Tipos:

- primario;
- secundario;
- destructivo.

Los botones principales son amplios cuando corresponde, pero mantienen una altura moderada.

En Nueva medición, el botón de guardado utiliza el color verde definido para la acción de éxito/guardado.

## 21.7 Iconografía

Se mantiene una familia consistente de iconos para la navegación y las acciones principales.

Principales:

- Inicio;
- Registros;
- Perfil;
- Más;
- Nueva medición;
- Estadísticas;
- Reportes;
- Configuración;
- Importar;
- Exportar;
- Health Connect;
- Editar;
- Eliminar;
- Fecha;
- Hora.

No utilizar emojis como iconografía de interfaz.

---

# 22. Barra inferior

La barra inferior implementada utiliza la estructura:

`Inicio | Registros | Perfil | Más`

Estado activo:

- azul;
- icono y etiqueta destacados.

Estado inactivo:

- gris;
- menor contraste.

Fondo:

- blanco.

La barra debe ser compacta y consistente.

---

# 23. FAB

El FAB implementado:

- es azul;
- contiene `+`;
- representa nueva medición;
- aparece en Inicio;
- aparece en Registros.

No aparece en pantallas donde no tenga utilidad.

---

# 24. Principios de implementación

Durante la implementación se mantuvieron los siguientes principios:

1. No modificar funcionalidad estable sin necesidad.
2. No duplicar lógica existente.
3. Reutilizar componentes.
4. Centralizar estilos en `src/theme`.
5. Mantener TypeScript strict.
6. Mantener Expo SDK 57.
7. Evaluar dependencias antes de incorporarlas.
8. Ejecutar `npx tsc --noEmit` después de cada bloque funcional.
9. Resolver errores de compilación antes de continuar.
10. Trabajar por bloques y checkpoints para limitar el impacto de cada cambio.
11. Mantener la arquitectura:
   - `src/core`
   - `src/domain`
   - `src/features`
   - `src/components`

El rediseño se mantuvo principalmente dentro de la capa de presentación y componentes, evitando trasladar responsabilidades visuales al dominio.

---

# 25. Estrategia de implementación realizada

El rediseño se implementó de forma incremental.

El trabajo siguió conceptualmente este orden:

1. sistema visual base;
2. navegación;
3. Inicio;
4. Registros;
5. Detalle;
6. Nueva medición;
7. Perfil;
8. Más / Configuración;
9. Estadísticas;
10. ClinicalChart;
11. Reportes;
12. ajustes visuales finales;
13. revisión y compilación.

Cada bloque se verificó antes de continuar con el siguiente.

Se utilizó `npx tsc --noEmit` como comprobación de compilación durante el proceso.

---

# 26. Cambios finales respecto del diseño conceptual original

Durante la implementación surgieron decisiones que ajustaron el diseño inicial.

## 26.1 Inicio

Se eliminó el botón:

`Ver registros`

que aparecía debajo del resumen semanal.

La navegación hacia Registros queda exclusivamente en la navegación principal.

## 26.2 Indicador de clasificación

El indicador junto a la clasificación de la última medición evolucionó desde un punto estático hacia un pequeño indicador visual animado.

Utiliza el color semántico de la clasificación y una animación de destello sutil.

El objetivo es proporcionar reconocimiento visual inmediato sin modificar el contenido clínico.

## 26.3 Clasificaciones

La interfaz utiliza las categorías provenientes del dominio clínico.

Entre ellas:

- Presión arterial normal;
- Presión arterial limítrofe;
- Hipertensión arterial nivel 1;
- Hipertensión arterial nivel 2;
- Hipertensión sistólica aislada.

La presentación visual utiliza colores semánticos asociados a cada categoría.

Las categorías de mayor severidad reciben colores de mayor contraste visual.

## 26.4 Reportes

Se decidió no incorporar el gráfico de dispersión al reporte.

El reporte conserva exclusivamente el contenido definido para la versión final.

La prioridad fue mejorar la presentación del contenido existente en lugar de incrementar la cantidad de elementos.

## 26.5 Almacenamiento temporal de reportes

Los PDF generados para compartir se manejan como archivos temporales.

Después de completar el flujo de compartir, el archivo temporal se elimina.

El objetivo es evitar que la generación repetida de reportes produzca una acumulación innecesaria de archivos dentro del almacenamiento de la aplicación.

El reporte que el usuario decida guardar externamente queda bajo el control del destino elegido durante el proceso de compartir.

## 26.6 Nueva medición

El botón de guardado utiliza el color verde definido para la acción de guardado.

El estado de carga existente continúa utilizando `ActivityIndicator`.

No se agregó una animación adicional posterior al guardado para evitar introducir una interacción innecesaria.

---

# 27. Resultado del Rediseño Visual V2

El resultado final conserva la funcionalidad existente de CardioSync y modifica principalmente su presentación.

La interfaz final prioriza:

- lectura rápida;
- jerarquía clínica;
- menor densidad visual;
- componentes consistentes;
- acciones principales claramente identificables;
- separación entre información clínica y configuración;
- navegación simplificada;
- uso consistente de colores semánticos;
- reutilización de componentes;
- comportamiento visual coherente entre pantallas.

La última medición tiene prioridad visual en Inicio.

El historial prioriza la lectura rápida.

Nueva medición prioriza la carga de PAS, PAD y FC.

Estadísticas concentra el análisis detallado.

Reportes concentra la generación y distribución del informe.

Perfil concentra la información del usuario.

Más concentra las funciones secundarias y Configuración.

---

# 28. Cierre

El Rediseño Visual V2 queda documentado como una evolución visual de la aplicación sobre la arquitectura funcional existente.

No constituye una nueva arquitectura de dominio ni reemplaza las reglas clínicas, servicios o mecanismos de persistencia.

La implementación mantiene como restricciones técnicas principales:

- Expo SDK 57;
- React Native;
- TypeScript strict;
- arquitectura `src/core`, `src/domain`, `src/features`, `src/components`;
- reutilización de componentes;
- centralización del sistema visual;
- validación mediante compilación TypeScript.

Este documento pasa a ser la referencia técnica del estado final del Rediseño Visual V2 implementado durante agosto de 2026.
