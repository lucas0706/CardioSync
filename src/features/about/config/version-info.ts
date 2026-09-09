export const VERSION_INFO = {
  appName: 'CardioSync',

  description:
    'Monitoreo inteligente de presión arterial',

  version: '1.0.0',

  releaseDate: '09/09/2026',

  status: 'Beta privada',

  technical: {
    expoSdk: '57',
    reactNative: '0.86.2',
    platform: 'Android',
    database: 'SQLite',
  },

  links: {
    privacyPolicy: 'Próximamente',
    website: 'Próximamente',
    contact: 'Próximamente',
  },

  highlights: [
    {
      title:
        'Objetivos terapéuticos basados en Consenso Argentino HTA 2025',

      items: [
        'Clasificación clínica de presión arterial',
        'Objetivos terapéuticos personalizados',
        'Evaluación de control tensional',
        'Reglas clínicas y advertencias de seguridad',
      ],
    },

    {
      title: 'Ecosistema Health Connect',

      items: [
        'Presión arterial',
        'Frecuencia cardíaca',
        'Peso corporal',
        'Sueño',
        'Pasos',
        'Ejercicio',
        'Resumen de salud integrado',
      ],
    },

    {
      title: 'Reportes clínicos',

      items: [
        'Generación de reportes PDF',
        'Contexto clínico integrado',
        'Historial de presión arterial',
      ],
    },

    {
      title: 'Estadísticas avanzadas',

      items: [
        'Promedios y tendencias',
        'Variabilidad tensional',
        'Carga hipertensiva',
        'Tiempo en objetivo terapéutico',
        'Clasificación clínica automática',
      ],
    },

    {
      title: 'Gestión de datos',

      items: [
        'Importación CSV',
        'Importación SQLite',
        'Backup local',
        'Restauración de datos',
        'Integración Google Drive',
      ],
    },
  ],
} as const
