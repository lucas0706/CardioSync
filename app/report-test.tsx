import {
  Alert,
  StyleSheet,
  View,
} from 'react-native'

import { useState } from 'react'
import { useRouter } from 'expo-router'

import {
  Button,
  Card,
  Screen,
  Text,
} from '@/components/ui'

import {
  countReportTestData,
  removeReportTestData,
  seedReportTestData,
} from '@/devtools/reports/ReportTestData'

import {
  getStatisticsAuditData,
  removeStatisticsAuditData,
  seedStatisticsAuditData,
} from '@/devtools/statistics/StatisticsAuditData'

import { reportService } from '@/features/reports/services/ReportService'

import type { StatisticsFilter } from '@/domain/statistics/models'
import { measurementService } from '@/features/measurements/services/MeasurementService'

export default function ReportTestScreen() {
  const router = useRouter()

  const [
    reportCount,
    setReportCount,
  ] = useState(
    countReportTestData(),
  )

  const [
    statisticsAuditCount,
    setStatisticsAuditCount,
  ] = useState(
    getStatisticsAuditData().length,
  )

  const seedReportData = () => {
    const inserted =
      seedReportTestData()

    setReportCount(
      countReportTestData(),
    )

    const records =
      measurementService.getAll()

    const now = new Date()

    const startDate = new Date(now)
    startDate.setDate(
      startDate.getDate() - 30,
    )

    const filter: StatisticsFilter = {
      period: '30d',
      startDate,
      endDate: now,
    }

    const report =
      reportService.build(
        records,
        filter,
      )

    Alert.alert(
      'Datos creados',
      `Se agregaron ${inserted} registros de prueba para Reportes.`,
    )
  }

  const openRedesignReport = () => {
    const records =
      measurementService.getAll()

    const now = new Date()

    const startDate = new Date(now)
    startDate.setDate(
      startDate.getDate() - 30,
    )

    const filter: StatisticsFilter = {
      period: '30d',
      startDate,
      endDate: now,
    }

    router.push('/report-redesign-dev')
  }

  const removeReportData = () => {
    removeReportTestData()

    setReportCount(
      countReportTestData(),
    )

    Alert.alert(
      'Datos eliminados',
      'Se eliminaron únicamente los registros de prueba de Reportes.',
    )
  }

  const seedStatisticsAudit = () => {
    const inserted =
      seedStatisticsAuditData()

    setStatisticsAuditCount(
      getStatisticsAuditData().length,
    )

    Alert.alert(
      'Auditoría creada',
      `Se agregaron ${inserted} registros controlados para auditar Estadísticas.`,
    )
  }

  const removeStatisticsAudit = () => {
    removeStatisticsAuditData()

    setStatisticsAuditCount(
      getStatisticsAuditData().length,
    )

    Alert.alert(
      'Auditoría eliminada',
      'Se eliminaron únicamente los registros de auditoría de Estadísticas.',
    )
  }

  return (
    <Screen>
      <View style={styles.content}>
        <Text variant="h1">
          Datos de prueba
        </Text>

        <Card>
          <Text variant="title">
            Reporte 30 días
          </Text>

          <Text>
            Registros actuales:
            {' '}
            {reportCount}
          </Text>

          <Text>
            Dataset de 60 registros:
            2 por día durante 30 días.
          </Text>
        </Card>

        <Button
          title="Crear 60 registros"
          onPress={seedReportData}
        />

        <Button
          title="Eliminar registros de prueba"
          onPress={removeReportData}
        />

        <Button
          title="Abrir Reporte Redesign V1"
          onPress={openRedesignReport}
        />

        <Card>
          <Text variant="title">
            Auditoría de Estadísticas
          </Text>

          <Text>
            Registros actuales:
            {' '}
            {statisticsAuditCount}
          </Text>

          <Text>
            Dataset controlado de 9 registros.
          </Text>

          <Text>
            Incluye días sin mediciones y registros
            sin frecuencia cardíaca.
          </Text>
        </Card>

        <Button
          title="Crear dataset de auditoría"
          onPress={seedStatisticsAudit}
        />

        <Button
          title="Eliminar dataset de auditoría"
          onPress={removeStatisticsAudit}
        />
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
  },
})
