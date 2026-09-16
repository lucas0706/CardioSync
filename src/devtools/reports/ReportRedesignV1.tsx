import React from 'react'
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import type { BloodPressureRecord } from '@/domain/measurements/BloodPressureRecord'
import { BloodPressureClassifier } from '@/domain/clinical/classification'
import type { BloodPressureReport } from '@/features/reports/models/BloodPressureReport'

function formatDate(value: string): string {
  const date = new Date(value)

  return (
    `${String(date.getDate()).padStart(2, '0')}/` +
    `${String(date.getMonth() + 1).padStart(2, '0')}/` +
    `${date.getFullYear()}`
  )
}

function formatTime(value: string): string {
  const date = new Date(value)

  return (
    `${String(date.getHours()).padStart(2, '0')}:` +
    `${String(date.getMinutes()).padStart(2, '0')}`
  )
}

function formatNumber(
  value: number | undefined,
  decimals = 0,
): string {
  if (
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return '—'
  }

  return value.toFixed(decimals)
}

function getPeriodLabel(
  report: BloodPressureReport,
): string {
  switch (report.filter.period) {
    case '7d':
      return 'Últimos 7 días'

    case '30d':
      return 'Últimos 30 días'

    case '90d':
      return 'Últimos 90 días'

    case 'custom':
      if (
        report.filter.startDate &&
        report.filter.endDate
      ) {
        return (
          `${formatDate(
            report.filter.startDate.toISOString(),
          )} — ` +
          formatDate(
            report.filter.endDate.toISOString(),
          )
        )
      }

      return 'Período personalizado'

    default:
      return 'Período seleccionado'
  }
}

function getClassificationLabel(
  category: string,
): string {
  switch (category) {
    case 'normal':
      return 'Normal'

    case 'borderline':
      return 'Limítrofe'

    case 'grade-1':
      return 'Hipertensión arterial nivel 1'

    case 'grade-2':
      return 'Hipertensión arterial nivel 2'

    case 'isolated-systolic':
      return 'Hipertensión sistólica aislada'

    default:
      return category
  }
}

function getClassificationColor(
  category: string,
): string {
  switch (category) {
    case 'normal':
      return '#16A34A'

    case 'borderline':
      return '#CA8A04'

    case 'grade-1':
      return '#EA580C'

    case 'grade-2':
      return '#DC2626'

    case 'isolated-systolic':
      return '#7C3AED'

    default:
      return '#64748B'
  }
}

function classifyRecord(
  record: BloodPressureRecord,
) {
  return BloodPressureClassifier.classify(
    record.systolic,
    record.diastolic,
  )
}

function Metric({
  label,
  value,
  unit,
}: {
  label: string
  value: string
  unit?: string
}) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricLabel}>
        {label}
      </Text>

      <View style={styles.metricValueRow}>
        <Text style={styles.metricValue}>
          {value}
        </Text>

        {unit ? (
          <Text style={styles.metricUnit}>
            {unit}
          </Text>
        ) : null}
      </View>
    </View>
  )
}

function SectionTitle({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionIndicator} />

      <Text style={styles.sectionTitle}>
        {children}
      </Text>
    </View>
  )
}

function RecordRow({
  record,
  index,
}: {
  record: BloodPressureRecord
  index: number
}) {
  const classification =
    classifyRecord(record)

  return (
    <View style={styles.recordRow}>
      <Text style={styles.recordIndex}>
        {index + 1}
      </Text>

      <View style={styles.recordDate}>
        <Text style={styles.recordDateText}>
          {formatDate(record.dateTime)}
        </Text>

        <Text style={styles.recordTimeText}>
          {formatTime(record.dateTime)}
        </Text>
      </View>

      <View style={styles.recordPressure}>
        <Text style={styles.recordPressureValue}>
          {record.systolic}/{record.diastolic}
        </Text>

        <Text style={styles.recordUnit}>
          mmHg
        </Text>
      </View>

      <View style={styles.recordHeartRate}>
        <Text style={styles.recordHeartRateValue}>
          {formatNumber(record.heartRate)}
        </Text>

        <Text style={styles.recordUnit}>
          lpm
        </Text>
      </View>

      <View style={styles.recordClassification}>
        <View
          style={[
            styles.classificationDot,
            {
              backgroundColor:
                classification.color,
            },
          ]}
        />

        <Text
          style={[
            styles.recordClassificationText,
            {
              color: classification.color,
            },
          ]}
          numberOfLines={2}
        >
          {classification.label}
        </Text>
      </View>
    </View>
  )
}

export function ReportRedesignV1({
  report,
}: {
  report: BloodPressureReport
}) {
  const records = [
    ...report.records,
  ].sort(
    (a, b) =>
      new Date(b.dateTime).getTime() -
      new Date(a.dateTime).getTime(),
  )

  const summary = report.summary

  const distribution =
    Object.entries(
      summary.classificationDistribution ?? {},
    ).map(([category, count]) => ({
      category,
      count,
      label:
        getClassificationLabel(category),
      color:
        getClassificationColor(category),
    }))

  const totalRecords = records.length

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={
        styles.contentContainer
      }
      showsVerticalScrollIndicator
    >
      <View style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>
              CARDIOSYNC
            </Text>

            <Text style={styles.reportTitle}>
              Informe de presión arterial
            </Text>

            <Text style={styles.period}>
              {getPeriodLabel(report)}
            </Text>
          </View>

          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>
              REPORTE
            </Text>
          </View>
        </View>

        <View style={styles.patientCard}>
          <View style={styles.patientMain}>
            <Text style={styles.variableLabel}>
              PACIENTE
            </Text>

            <Text style={styles.patientName}>
              {report.patientName ||
                'Paciente sin nombre'}
            </Text>
          </View>

          <View style={styles.patientData}>
            <Text style={styles.variableLabel}>
              EDAD
            </Text>

            <Text style={styles.patientDataValue}>
              {report.patientAge !== undefined
                ? `${report.patientAge} años`
                : '—'}
            </Text>
          </View>

          <View style={styles.patientData}>
            <Text style={styles.variableLabel}>
              REGISTROS
            </Text>

            <Text style={styles.patientDataValue}>
              {totalRecords}
            </Text>
          </View>
        </View>

        <SectionTitle>
          Resumen del período
        </SectionTitle>

        <View style={styles.metricsGrid}>
          <Metric
            label="Presión sistólica promedio"
            value={formatNumber(
              summary.averageSystolic,
              1,
            )}
            unit="mmHg"
          />

          <Metric
            label="Presión diastólica promedio"
            value={formatNumber(
              summary.averageDiastolic,
              1,
            )}
            unit="mmHg"
          />

          <Metric
            label="Frecuencia cardíaca promedio"
            value={formatNumber(
              summary.averageHeartRate,
              1,
            )}
            unit="lpm"
          />

          <Metric
            label="Presión arterial máxima"
            value={
              summary.maxSystolic !== undefined &&
              summary.maxDiastolic !== undefined
                ? `${summary.maxSystolic}/${summary.maxDiastolic}`
                : '—'
            }
            unit="mmHg"
          />
        </View>

        <SectionTitle>
          Registros de medición
        </SectionTitle>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderIndex}>
              #
            </Text>

            <Text style={styles.tableHeaderDate}>
              FECHA / HORA
            </Text>

            <Text style={styles.tableHeaderPressure}>
              PRESIÓN
            </Text>

            <Text style={styles.tableHeaderFc}>
              FC
            </Text>

            <Text style={styles.tableHeaderClassification}>
              CLASIFICACIÓN
            </Text>
          </View>

          {records.length > 0 ? (
            records.map((record, index) => (
              <RecordRow
                key={
                  record.id ??
                  `${record.dateTime}-${index}`
                }
                record={record}
                index={index}
              />
            ))
          ) : (
            <View style={styles.emptyRow}>
              <Text style={styles.emptyText}>
                No hay registros en el período
                seleccionado.
              </Text>
            </View>
          )}
        </View>

        <SectionTitle>
          Distribución de clasificación
        </SectionTitle>

        <View style={styles.distribution}>
          {distribution.length > 0 ? (
            distribution.map(item => {
              const percentage =
                totalRecords > 0
                  ? Math.round(
                      (item.count /
                        totalRecords) *
                        100,
                    )
                  : 0

              return (
                <View
                  key={item.category}
                  style={styles.distributionRow}
                >
                  <View
                    style={
                      styles.distributionName
                    }
                  >
                    <View
                      style={[
                        styles.classificationDot,
                        {
                          backgroundColor:
                            item.color,
                        },
                      ]}
                    />

                    <Text
                      style={
                        styles.distributionLabel
                      }
                    >
                      {item.label}
                    </Text>
                  </View>

                  <View
                    style={
                      styles.distributionBarContainer
                    }
                  >
                    <View
                      style={[
                        styles.distributionBar,
                        {
                          width: `${Math.max(
                            percentage,
                            percentage > 0
                              ? 2
                              : 0,
                          )}%`,
                          backgroundColor:
                            item.color,
                        },
                      ]}
                    />
                  </View>

                  <Text
                    style={
                      styles.distributionCount
                    }
                  >
                    {item.count}
                  </Text>

                  <Text
                    style={
                      styles.distributionPercentage
                    }
                  >
                    {percentage}%
                  </Text>
                </View>
              )
            })
          ) : (
            <Text style={styles.emptyText}>
              No hay datos de clasificación
              disponibles.
            </Text>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerTitle}>
            CardioSync
          </Text>

          <Text style={styles.footerText}>
            Informe generado a partir de los
            registros seleccionados.
          </Text>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8ECEB',
  },

  contentContainer: {
    paddingVertical: 24,
    paddingHorizontal: 14,
  },

  page: {
    width: '100%',
    maxWidth: 820,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 26,
    paddingTop: 28,
    paddingBottom: 24,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: 22,
    borderBottomWidth: 1,
    borderBottomColor: '#D7DEDB',
  },

  brand: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 2,
    color: '#167A58',
  },

  reportTitle: {
    marginTop: 5,
    fontSize: 25,
    fontWeight: '800',
    color: '#172033',
  },

  period: {
    marginTop: 5,
    fontSize: 13,
    fontWeight: '600',
    color: '#526174',
  },

  headerBadge: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 7,
    backgroundColor: '#E8F5EF',
  },

  headerBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    color: '#167A58',
  },

  patientCard: {
    marginTop: 18,
    padding: 18,
    borderRadius: 10,
    backgroundColor: '#F5F8F7',
    borderWidth: 1,
    borderColor: '#DCE5E1',
    flexDirection: 'row',
    alignItems: 'center',
  },

  patientMain: {
    flex: 1,
  },

  patientData: {
    minWidth: 90,
    marginLeft: 20,
  },

  variableLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: '#536273',
  },

  patientName: {
    marginTop: 4,
    fontSize: 18,
    fontWeight: '800',
    color: '#172033',
  },

  patientDataValue: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: '700',
    color: '#172033',
  },

  sectionHeader: {
    marginTop: 22,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  sectionIndicator: {
    width: 4,
    height: 18,
    borderRadius: 2,
    backgroundColor: '#167A58',
    marginRight: 8,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#172033',
  },

  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },

  metric: {
    flexGrow: 1,
    flexBasis: '23%',
    margin: 4,
    minWidth: 145,
    padding: 13,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#DCE5E1',
    backgroundColor: '#FFFFFF',
  },

  metricLabel: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    color: '#536273',
  },

  metricValueRow: {
    marginTop: 7,
    flexDirection: 'row',
    alignItems: 'baseline',
  },

  metricValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#172033',
  },

  metricUnit: {
    marginLeft: 4,
    fontSize: 10,
    fontWeight: '700',
    color: '#536273',
  },

  table: {
    borderWidth: 1,
    borderColor: '#D8E0DD',
    borderRadius: 8,
    overflow: 'hidden',
  },

  tableHeader: {
    minHeight: 34,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF3F1',
    borderBottomWidth: 1,
    borderBottomColor: '#D8E0DD',
  },

  tableHeaderIndex: {
    width: 28,
    paddingLeft: 8,
    fontSize: 9,
    fontWeight: '900',
    color: '#455365',
  },

  tableHeaderDate: {
    width: 125,
    fontSize: 9,
    fontWeight: '900',
    color: '#455365',
  },

  tableHeaderPressure: {
    width: 105,
    fontSize: 9,
    fontWeight: '900',
    color: '#455365',
  },

  tableHeaderFc: {
    width: 65,
    fontSize: 9,
    fontWeight: '900',
    color: '#455365',
  },

  tableHeaderClassification: {
    flex: 1,
    fontSize: 9,
    fontWeight: '900',
    color: '#455365',
  },

  recordRow: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5EAE8',
  },

  recordIndex: {
    width: 28,
    paddingLeft: 8,
    fontSize: 10,
    color: '#64748B',
  },

  recordDate: {
    width: 125,
  },

  recordDateText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#253246',
  },

  recordTimeText: {
    marginTop: 2,
    fontSize: 9,
    color: '#64748B',
  },

  recordPressure: {
    width: 105,
    flexDirection: 'row',
    alignItems: 'baseline',
  },

  recordPressureValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#172033',
  },

  recordHeartRate: {
    width: 65,
    flexDirection: 'row',
    alignItems: 'baseline',
  },

  recordHeartRateValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#253246',
  },

  recordUnit: {
    marginLeft: 2,
    fontSize: 8,
    color: '#64748B',
  },

  recordClassification: {
    flex: 1,
    paddingRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },

  classificationDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },

  recordClassificationText: {
    flex: 1,
    fontSize: 9,
    fontWeight: '700',
  },

  emptyRow: {
    padding: 20,
    alignItems: 'center',
  },

  emptyText: {
    fontSize: 12,
    color: '#64748B',
  },

  distribution: {
    padding: 15,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#DCE5E1',
    backgroundColor: '#F9FBFA',
  },

  distributionRow: {
    minHeight: 34,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 7,
  },

  distributionName: {
    width: 185,
    flexDirection: 'row',
    alignItems: 'center',
  },

  distributionLabel: {
    flex: 1,
    fontSize: 10,
    fontWeight: '700',
    color: '#253246',
  },

  distributionBarContainer: {
    flex: 1,
    height: 7,
    marginHorizontal: 12,
    borderRadius: 4,
    backgroundColor: '#E2E8E5',
    overflow: 'hidden',
  },

  distributionBar: {
    height: '100%',
    borderRadius: 4,
  },

  distributionCount: {
    width: 28,
    textAlign: 'right',
    fontSize: 11,
    fontWeight: '800',
    color: '#172033',
  },

  distributionPercentage: {
    width: 42,
    textAlign: 'right',
    fontSize: 10,
    fontWeight: '600',
    color: '#536273',
  },

  footer: {
    marginTop: 22,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#D8E0DD',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  footerTitle: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.8,
    color: '#167A58',
  },

  footerText: {
    fontSize: 9,
    color: '#64748B',
  },
})
