export const VERSION_INFO = {
  appName: 'CardioSync',

  description:
    'Monitoreo inteligente de presión arterial',

  version: '1.2.1',

  releaseDate: '17/10/2026',

  status: 'Producción',

  technical: {
    expoSdk: '57',
    reactNative: '0.86.3',
    platform: 'Android',
    database: 'SQLite',
  },

  highlights: [
    {
      title: 'Novedades de la versión 1.2.1',
      items: [
        'Nuevo widget para la pantalla de inicio de Android con acceso directo al formulario de nueva medición',
        'Acceso rápido al registro sin mostrar datos de salud en el widget',
      ],
    },
    {
      title: 'Mejoras anteriores',
      items: [
        'Mejoras en la clasificación de presión arterial y sus colores clínicos',
        'Mejoras en el flujo de registro de mediciones',
        'Valores predeterminados para brazo derecho y posición sentada',
        'Mejoras en el historial y los gráficos de estadísticas',
        'Aviso de actualización OTA instalada',
        'Mejoras en la fiabilidad de las copias de seguridad programadas',
        'Diagnósticos y seguimiento de las tareas de copia de seguridad',
        'Rediseño de informes clínicos y tabla de clasificación de mediciones',
        'Actualización de la configuración del runtime de Android para appVersion',
      ],
    },
  ],
} as const
