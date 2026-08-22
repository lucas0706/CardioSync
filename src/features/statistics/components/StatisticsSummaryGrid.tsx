import {
  StyleSheet,
  View,
} from 'react-native'

import {
  Text,
} from '@/components/ui'

import {
  BloodPressureClassifier,
} from '@/domain/clinical/classification'

import type {
  BloodPressureCategory,
} from '@/domain/clinical/classification'

import type {
  StatisticsSummary,
} from '@/domain/statistics/models'

import { StatisticsMetricCard } from './StatisticsMetricCard'
import { theme } from '@/theme'

interface Props {
  summary: StatisticsSummary
}

export function StatisticsSummaryGrid({
  summary,
}: Props) {
  const primaryMetrics = [
    {
      title: 'Mediciones',
      value:
        summary.totalMeasurements,
      description:
        'Cantidad de mediciones registradas durante el período seleccionado.',
    },
    {
      title: 'Presión promedio',
      value: `${Math.round(summary.averageSystolic)}/${Math.round(summary.averageDiastolic)}`,
      subtitle: 'mmHg',
      description:
        'Promedio de tus valores de presión arterial durante el período seleccionado.',
    },
    {
      title: 'Frecuencia cardíaca',
      value:
        summary.averageHeartRate !== undefined
          ? Math.round(
              summary.averageHeartRate,
            )
          : '--',
      subtitle: 'bpm',
      description:
        'Promedio de tus latidos por minuto registrados junto con las mediciones.',
    },
    {
      title: 'Presión arterial media',
      value:
        Math.round(
          summary.meanArterialPressureAverage,
        ),
      subtitle: 'mmHg',
      description:
        'Representa la presión promedio ejercida en las arterias durante cada latido.',
    },
  ]

  const secondaryMetrics = [
    {
      title: 'Presión de pulso',
      value:
        Math.round(
          summary.pulsePressureAverage,
        ),
      subtitle: 'mmHg',
      description:
        'Es la diferencia entre la presión sistólica y la presión diastólica.',
    },
    {
      title: 'Variabilidad sistólica',
      value: `${summary.systolicVariability.toFixed(1)}%`,
      description:
        'Muestra cuánto pueden cambiar entre sí tus valores de presión sistólica.',
    },
    {
      title: 'Variabilidad diastólica',
      value: `${summary.diastolicVariability.toFixed(1)}%`,
      description:
        'Muestra cuánto pueden cambiar entre sí tus valores de presión diastólica.',
    },
    {
      title: 'Valor máximo',
      value: `${summary.maximumSystolic}/${summary.maximumDiastolic}`,
      subtitle: 'mmHg',
      description:
        'Valor de presión arterial más alto registrado durante el período seleccionado.',
    },
    {
      title: 'Valor mínimo',
      value: `${summary.minimumSystolic}/${summary.minimumDiastolic}`,
      subtitle: 'mmHg',
      description:
        'Valor de presión arterial más bajo registrado durante el período seleccionado.',
    },
    {
      title: 'Desviación estándar sistólica',
      value:
        summary.systolicStandardDeviation.toFixed(
          1,
        ),
      description:
        'Indica cuánto se alejan, en promedio, tus valores de presión sistólica de su promedio.',
    },
    {
      title: 'Tendencia de las mediciones',
      value:
        summary.trend === 'up'
          ? 'En aumento'
          : summary.trend === 'down'
            ? 'En descenso'
            : 'Estable',
      description:
        'Indica si los valores de presión sistólica registrados tienden a subir, bajar o mantenerse estables durante el período seleccionado.',
    },
    {
      title: 'Regularidad de registros',
      value: `${summary.adherence.toFixed(0)}%`,
      description:
        'Porcentaje de intervalos entre mediciones consecutivas que cumplen el criterio interno de regularidad utilizado por CardioSync. Se calcula únicamente sobre los registros existentes y no representa cumplimiento de un protocolo de medición.',
    },
    {
      title: 'En objetivo según mediciones',
      value: `${summary.timeInTarget.toFixed(0)}%`,
      description:
        'Porcentaje de las mediciones registradas que se encuentran dentro del objetivo utilizado por el análisis. Representa proporción de mediciones, no porcentaje del tiempo real transcurrido.',
    },
    {
      title: 'Presión elevada según mediciones',
      value: `${summary.hypertensionLoad.toFixed(0)}%`,
      description:
        'Porcentaje de las mediciones registradas que presentan valores elevados según el criterio utilizado por el análisis. Representa proporción de mediciones, no porcentaje del tiempo real transcurrido.',
    },
  ]

  const classification =
    summary.predominantClassification
      ? BloodPressureClassifier.getClassification(
          summary.predominantClassification as BloodPressureCategory,
        ).label
      : '--'

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {primaryMetrics
          .slice(0, 2)
          .map(metric => (
            <StatisticsMetricCard
              key={metric.title}
              {...metric}
            />
          ))}
      </View>

      <View style={styles.row}>
        {primaryMetrics
          .slice(2, 4)
          .map(metric => (
            <StatisticsMetricCard
              key={metric.title}
              {...metric}
            />
          ))}
      </View>

      <View style={styles.secondaryGrid}>
        {secondaryMetrics.map(metric => (
          <View
            key={metric.title}
            style={styles.secondaryItem}
          >
            <StatisticsMetricCard
              {...metric}
            />
          </View>
        ))}
      </View>

      <StatisticsMetricCard
        title="Clasificación más frecuente"
        value={classification}
        description="Indica la categoría de presión que aparece con mayor frecuencia entre tus mediciones."
      />

      <Text
        style={styles.disclaimer}
      >
        Las métricas se calculan exclusivamente a partir
        de las mediciones registradas durante el período
        seleccionado. En una aplicación de uso domiciliario,
        estos valores describen los registros disponibles y
        no implican que las mediciones hayan seguido un
        protocolo clínico. No representan adherencia clínica
        ni porcentaje del tiempo real transcurrido y no
        sustituyen una evaluación profesional.
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.sm,
  },

  row: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },

  secondaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },

  secondaryItem: {
    width: '48%',
  },

  disclaimer: {
    marginTop: theme.spacing.xs,
    fontFamily:
      theme.typography.regular,
    fontSize:
      theme.typography.small,
    lineHeight: 18,
    color:
      theme.colors.textSecondary,
  },
})
