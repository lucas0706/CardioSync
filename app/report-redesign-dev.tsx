import React from 'react'
import {
  StyleSheet,
  View,
} from 'react-native'
import { WebView } from 'react-native-webview'
import {
  useSafeAreaInsets,
} from 'react-native-safe-area-context'

import { measurementService } from '@/features/measurements/services/MeasurementService'
import { reportService } from '@/features/reports/services/ReportService'
import type { StatisticsFilter } from '@/domain/statistics/models'

import { buildReportRedesignV1 } from '@/devtools/reports/ReportRedesignV1'

export default function ReportRedesignDevScreen() {
  const insets =
    useSafeAreaInsets()

  const records =
    measurementService.getAll()

  const now = new Date()

  const startDate =
    new Date(now)

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

  const html =
    buildReportRedesignV1(report)

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <WebView
        originWhitelist={['*']}
        source={{ html }}
        style={styles.webview}
        javaScriptEnabled={false}
        domStorageEnabled={false}
        showsVerticalScrollIndicator
        showsHorizontalScrollIndicator={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8ECEB',
  },

  webview: {
    flex: 1,
    backgroundColor: '#E8ECEB',
  },
})
