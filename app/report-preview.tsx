import React, {
  useEffect,
  useState,
} from 'react'

import {
  ActivityIndicator,
  Image,
  StyleSheet,
  View,
} from 'react-native'

import {
  useLocalSearchParams,
} from 'expo-router'

import { WebView } from 'react-native-webview'

import {
  useSafeAreaInsets,
} from 'react-native-safe-area-context'

import {
  Text,
} from '@/components/ui'

import { measurementService } from '@/features/measurements/services/MeasurementService'

import {
  reportService,
} from '@/features/reports/services/ReportService'

import {
  reportHealthContextBuilder,
} from '@/features/reports/services/ReportHealthContextBuilder'

import type {
  BloodPressureReport,
} from '@/features/reports/models/BloodPressureReport'

import type {
  StatisticsFilter,
} from '@/domain/statistics/models'

import {
  buildReportRedesignV1,
} from '@/features/reports/renderers/ReportRedesignV1'

export default function ReportPreviewScreen() {
  const insets =
    useSafeAreaInsets()

  const {
    period,
  } =
    useLocalSearchParams<{
      period?: string
    }>()

  const [
    html,
    setHtml,
  ] = useState<string>('')

  useEffect(() => {
    void (async () => {
      const records =
        measurementService.getAll()

      const now =
        new Date()

      const startDate =
        new Date(now)

      switch (period) {
        case '7d':
          startDate.setDate(
            now.getDate() - 7,
          )
          break

        case '90d':
          startDate.setDate(
            now.getDate() - 90,
          )
          break

        case '30d':
        default:
          startDate.setDate(
            now.getDate() - 30,
          )
      }

      const filter: StatisticsFilter =
        {
          period:
            (period as
              | '7d'
              | '30d'
              | '90d'
              | 'custom') ??
            '30d',

          startDate,
          endDate: now,
        }

      const report =
        reportService.build(
          records,
          filter,
        )

      const healthContext =
        await reportHealthContextBuilder.build()

      const reportWithContext:
        BloodPressureReport = {
          ...report,
          healthContext,
        }

      setHtml(
        buildReportRedesignV1(
          reportWithContext,
        ),
      )
    })()
  }, [period])

  if (!html) {
    return (
      <View style={styles.loader}>
        <Image
          source={require('../assets/images/icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>
          CardioSync
        </Text>

        <Text style={styles.subtitle}>
          Generando informe clínico
        </Text>

        <Text style={styles.description}>
          Analizando mediciones e
          integrando datos de
          Health Connect...
        </Text>

        <ActivityIndicator
          size="large"
        />
      </View>
    )
  }

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop:
            insets.top,

          paddingBottom:
            insets.bottom,
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
        showsHorizontalScrollIndicator={
          false
        }
      />
    </View>
  )
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        '#EDF4FF',
    },

    webview: {
      flex: 1,
      backgroundColor:
        '#EDF4FF',
    },

    loader: {
      flex: 1,
      justifyContent:
        'center',
      alignItems:
        'center',
      paddingHorizontal:
        32,
      backgroundColor:
        '#EDF4FF',
    },

    logo: {
      width: 120,
      height: 120,
      marginBottom: 20,
    },

    title: {
      fontSize: 28,
      fontWeight: '700',
      color: '#2563EB',
      marginBottom: 8,
    },

    subtitle: {
      fontSize: 18,
      fontWeight: '600',
      textAlign: 'center',
      marginBottom: 8,
    },

    description: {
      fontSize: 14,
      textAlign: 'center',
      opacity: 0.7,
      marginBottom: 24,
      lineHeight: 20,
    },
  })
