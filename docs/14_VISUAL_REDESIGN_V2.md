# CardioSync — Visual Redesign V2

**Estado:** Diseño aprobado — pendiente de implementación  
**Fecha:** 2026-08-13  
**Base:** estado funcional existente de CardioSync

---

## 1. Objetivo

El Rediseño Visual V2 tiene como objetivo evolucionar la interfaz actual de CardioSync hacia una experiencia de aplicación de salud moderna, clara y clínicamente legible, manteniendo las funcionalidades y la arquitectura existentes.

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

El rediseño no implica una reimplementación del dominio funcional.

---

## 2. Principio fundamental

La funcionalidad existente es la fuente de verdad.

El rediseño modifica principalmente:

- presentación;
- jerarquía;
- composición;
- navegación;
- componentes visuales;
- estilos;
- densidad de información;
- interacción visual.

No se deben modificar innecesariamente:

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

Se utilizarán primero las dependencias existentes.

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

La navegación inferior definitiva será:

`Inicio | Registros | Perfil | Más`

### 4.1 Inicio

Dashboard principal.

### 4.2 Registros

Historial de mediciones.

### 4.3 Perfil

Información personal y clínica del usuario.

### 4.4 Más

Funciones secundarias y acceso a configuración.

---

## 5. Acción rápida

El botón flotante `+` representa:

**Nueva medición**

Debe aparecer en:

- Inicio;
- Registros.

No debe aparecer en pantallas donde no tenga sentido.

No se agregará otro bloque de "Nueva medición" dentro de Inicio porque el FAB ya cumple esa función.

---

# 6. Inicio / Dashboard

## 6.1 Estructura

La pantalla debe contener:

1. saludo;
2. nombre del usuario;
3. selector/botón de fecha;
4. última medición;
5. resumen semanal.

No se mostrará un gráfico directamente en Inicio.

No se agregará una sección de accesos rápidos.

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

## 7.2 Segunda línea

Contiene, cuando exista:

- frecuencia cardíaca;
- hora;
- brazo;
- posición.

## 7.3 Alerta clínica

La alerta clínica NO se muestra en el listado de History.

Solo se muestra al abrir el detalle de la medición.

## 7.4 Acciones

Tocar una medición abre su detalle.

No se muestran permanentemente botones Editar/Eliminar en cada tarjeta.

El FAB `+` permite crear una nueva medición.

---

# 8. Detalle de medición

El detalle debe permitir comprender completamente una medición y ejecutar acciones.

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

`PAS / PAD` será el elemento dominante.

## 8.2 Clasificación

Se muestra debajo de la presión con:

- nombre completo;
- color semántico correspondiente.

## 8.3 Frecuencia cardíaca

Debe utilizar una card independiente.

## 8.4 Alerta clínica

Debe aparecer debajo de la frecuencia cardíaca.

## 8.5 Información

Mostrar solamente datos existentes:

- fecha;
- hora;
- brazo;
- posición.

## 8.6 Notas

Si no existen notas, la sección se oculta.

## 8.7 Acciones

Dos botones independientes:

- Editar medición;
- Eliminar medición.

La eliminación conserva confirmación.

---

# 9. Nueva medición / Measurement

La pantalla debe priorizar la introducción rápida de la medición.

## 9.1 Bloque principal

PAS, PAD y FC deben estar dentro del mismo bloque.

Los tres tendrán el mismo tamaño y jerarquía visual.

Conceptualmente:

`PAS | PAD | FC`

El botón Guardar debe ser ancho, pero de altura moderada.

## 9.2 Detalles

Se utilizarán filas compactas para:

- fecha y hora;
- brazo;
- posición.

## 9.3 Notas

Notas se presenta como una fila que permite abrir/agregar el contenido.

No ocupa permanentemente una caja grande.

## 9.4 Foco inicial

La interacción inicial debe facilitar la carga de:

`PAS → PAD → FC`

---

# 10. Estadísticas

Las estadísticas existentes se mantienen.

No se eliminan métricas existentes.

La pantalla se reorganiza visualmente.

Orden conceptual:

1. selector de período;
2. resumen principal;
3. gráfico;
4. variabilidad;
5. otros indicadores;
6. clasificación;
7. distribución clínica.

## 10.1 Selector

Mantener:

- 7 días;
- 30 días;
- 90 días;
- personalizado.

## 10.2 Gráfico

PAS, PAD y FC permanecen en el mismo gráfico.

Se mantienen las funcionalidades actuales de:

- zoom;
- desplazamiento;
- selección de series;
- interacción.

## 10.3 Rediseño del ClinicalChart

El gráfico actual será rediseñado visualmente.

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

El contenido del reporte permanece fijo.

El usuario selecciona el período, pero no selecciona individualmente qué contenidos incluir.

Estructura:

1. título/descripción;
2. período;
3. contenido del reporte;
4. resumen;
5. generar y compartir PDF.

El contenido se mantiene estandarizado.

El botón principal será ancho y de altura moderada.

---

# 12. Perfil

La barra inferior mostrará:

`Perfil`

No:

`Configuración`

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

Pantalla independiente para datos básicos del usuario.

Los datos existentes se conservan.

---

# 14. Datos antropométricos

Pantalla independiente para datos antropométricos.

El IMC se puede mostrar como valor calculado si el dominio actual lo permite.

No se debe inventar una clasificación de IMC si no existe actualmente en la implementación.

Primero se verificará el cálculo existente.

---

# 15. Factores de riesgo

Los factores de riesgo se mantienen agrupados en una única pantalla.

Se utilizarán selectores segmentados tipo:

`Sí | No`

La interacción debe ser compacta y clara.

---

# 16. Antecedentes cardiovasculares

Mismo patrón visual que Factores de riesgo.

Los antecedentes permanecen agrupados en una pantalla.

Se utilizarán selectores:

`Sí | No`

---

# 17. Datos automáticos

Perfil puede mostrar qué datos pueden obtenerse automáticamente.

Ejemplos:

- peso;
- frecuencia cardíaca;
- actividad física;
- sueño;
- SpO₂;
- otros datos compatibles futuros.

Perfil NO administra la conexión.

---

# 18. Más

La navegación Más tendrá:

## Análisis

- Estadísticas;
- Reportes.

## Configuración

- Configuración.

La barra inferior no muestra Estadísticas ni Reportes directamente.

---

# 19. Configuración

Configuración administra funciones de la aplicación e integraciones.

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

La gestión de Health Connect pertenece a:

`Más → Configuración → Health Connect`

No pertenece al Perfil.

Perfil puede mostrar datos disponibles provenientes de Health Connect, pero la gestión de conexión, permisos y sincronización pertenece a Configuración.

---

# 21. Design System

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

Dirección visual:

**DM Sans**

Se debe evaluar su integración real antes de agregar una dependencia.

Jerarquía:

- títulos;
- subtítulos;
- valores clínicos;
- cuerpo;
- captions;
- textos auxiliares.

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

El botón primario será ancho cuando corresponda, pero no excesivamente alto.

## 21.7 Iconografía

Debe utilizarse una familia consistente de iconos.

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

Estructura definitiva:

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

El FAB:

- es azul;
- contiene `+`;
- representa nueva medición;
- aparece en Inicio;
- aparece en Registros.

No aparece en pantallas donde no tenga utilidad.

---

# 24. Principios de implementación

1. No modificar funcionalidad estable sin necesidad.
2. No duplicar lógica existente.
3. Reutilizar componentes.
4. Centralizar estilos en `src/theme`.
5. Mantener TypeScript strict.
6. Mantener Expo SDK 57.
7. Evaluar dependencias antes de incorporarlas.
8. Ejecutar `npx tsc --noEmit` después de cada bloque funcional.
9. Resolver errores antes de continuar.
10. No realizar grandes cambios simultáneos sin checkpoint.
11. Mantener la arquitectura:
   - `src/core`
   - `src/domain`
   - `src/features`
   - `src/components`

---

# 25. Estrategia de implementación

Orden previsto:

1. Sistema visual base.
2. Navegación.
3. Inicio.
4. Registros.
5. Detalle.
6. Nueva medición.
7. Perfil.
8. Más / Configuración.
9. Estadísticas.
10. ClinicalChart.
11. Reportes.
12. Importar.
13. Estados, accesibilidad y revisión final.

Cada etapa deberá compilar antes de iniciar la siguiente.

---

# 26. Estado

El diseño conceptual V2 queda aprobado como referencia de implementación.

La implementación todavía no comenzó.

El siguiente paso es establecer el sistema visual base sobre los componentes y theme existentes, sin alterar todavía la lógica funcional.
