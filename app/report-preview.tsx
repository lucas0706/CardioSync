import React, { useEffect, useRef, useState } from 'react'

import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  ToastAndroid,
  View,
  useWindowDimensions,
} from 'react-native'

import Ionicons from '@expo/vector-icons/Ionicons'

import { useLocalSearchParams } from 'expo-router'

import { WebView } from 'react-native-webview'

import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Text } from '@/components/ui'

import * as Clipboard from 'expo-clipboard'

import { measurementService } from '@/features/measurements/services/MeasurementService'

import { reportService } from '@/features/reports/services/ReportService'

import { reportHealthContextBuilder } from '@/features/reports/services/ReportHealthContextBuilder'

import type { BloodPressureReport } from '@/features/reports/models/BloodPressureReport'

import type { StatisticsFilter } from '@/domain/statistics/models'

import { ReportPdfService } from '@/features/reports/services/ReportPdfService'

import { buildReportRedesignV1 } from '@/features/reports/renderers/ReportRedesignV1'

import { theme } from '@/theme'

type ReportAction = 'copy' | 'pdf' | 'share'
const REPORT_ACTIONS: {
  action: ReportAction
  label: string
  icon: React.ComponentProps<typeof Ionicons>['name']
}[] = [
  { action: 'copy', label: 'Copiar reporte', icon: 'copy-outline' },
  { action: 'pdf', label: 'Generar PDF', icon: 'document-text-outline' },
  { action: 'share', label: 'Compartir reporte PDF', icon: 'share-outline' },
]

function extractReportText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<svg[\s\S]*?<\/svg>/gi, ' Gráfico ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(?:p|div|h[1-6]|li|tr|section|article|table|ul|ol)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/[ \t]+/g, ' ')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export default function ReportPreviewScreen() {
  const insets = useSafeAreaInsets()
  const { width } = useWindowDimensions()

  const {
    period,
    startDate: startDateParam,
    endDate: endDateParam,
  } = useLocalSearchParams<{
    period?: string
    startDate?: string
    endDate?: string
  }>()

  const [html, setHtml] = useState<string>('')

  const [report, setReport] = useState<BloodPressureReport>()
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuMounted, setMenuMounted] = useState(false)
  const [processingAction, setProcessingAction] = useState<ReportAction | null>(null)
  const processingRef = useRef(false)
  const menuAnimation = useRef(new Animated.Value(0)).current
  const verticalMenu = width < 360

  useEffect(() => {
    const animation = Animated.timing(menuAnimation, {
      toValue: menuOpen ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
    })

    animation.start(({ finished }) => {
      if (finished && !menuOpen) {
        setMenuMounted(false)
      }
    })

    return () => animation.stop()
  }, [menuAnimation, menuOpen])

  useEffect(() => {
    void (async () => {
      const records = measurementService.getAll()

      const now = new Date()

      let startDate: Date
      let endDate: Date

      if (period === 'custom' && startDateParam && endDateParam) {
        startDate = new Date(startDateParam)

        endDate = new Date(endDateParam)
      } else {
        startDate = new Date(now)

        endDate = now

        switch (period) {
          case '7d':
            startDate.setDate(now.getDate() - 7)
            break

          case '90d':
            startDate.setDate(now.getDate() - 90)
            break

          case '30d':
          default:
            startDate.setDate(now.getDate() - 30)
        }
      }

      const filter: StatisticsFilter = {
        period: (period as '7d' | '30d' | '90d' | 'custom') ?? '30d',

        startDate,
        endDate,
      }

      const reportData = reportService.build(records, filter)

      const healthContext = await reportHealthContextBuilder.build()

      const reportWithContext: BloodPressureReport = {
        ...reportData,
        healthContext,
      }

      setReport(reportWithContext)
      setHtml(buildReportRedesignV1(reportWithContext))
    })()
  }, [period, startDateParam, endDateParam])

  async function runReportAction(action: ReportAction): Promise<void> {
    if (processingRef.current || !report) {
      return
    }

    processingRef.current = true
    setProcessingAction(action)

    try {
      if (action === 'copy') {
        await Clipboard.setStringAsync(extractReportText(html))
        setMenuOpen(false)

        if (Platform.OS === 'android') {
          ToastAndroid.show('Reporte copiado', ToastAndroid.SHORT)
        } else {
          Alert.alert('Reporte copiado', 'El reporte se copió al portapapeles.')
        }
        return
      }

      const uri = await ReportPdfService.generate(report)

      if (action === 'pdf') {
        await ReportPdfService.print(uri)
      } else {
        setMenuOpen(false)
        await ReportPdfService.share(uri)
      }
    } catch (error) {
      Alert.alert(
        'No se pudo completar la acción',
        error instanceof Error ? error.message : 'Ocurrió un error al preparar el reporte.',
      )
    } finally {
      setMenuOpen(false)
      processingRef.current = false
      setProcessingAction(null)
    }
  }

  function toggleMenu(): void {
    if (processingRef.current) {
      return
    }

    const nextOpen = !menuOpen
    if (nextOpen) {
      setMenuMounted(true)
    }
    setMenuOpen(nextOpen)
  }

  function renderMenuAction(item: (typeof REPORT_ACTIONS)[number]) {
    const translateY = menuAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [verticalMenu ? -8 : 8, 0],
    })
    const translateX = menuAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [verticalMenu ? 0 : 8, 0],
    })

    return (
      <Animated.View
        key={item.action}
        style={[
          styles.menuAction,
          {
            opacity: menuAnimation,
            transform: [{ translateX }, { translateY }],
          },
        ]}
        pointerEvents={menuOpen && !processingAction ? 'auto' : 'none'}
        accessibilityElementsHidden={!menuOpen}
        importantForAccessibility={menuOpen ? 'auto' : 'no-hide-descendants'}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={item.label}
          disabled={processingAction !== null}
          onPress={() => {
            void runReportAction(item.action)
          }}
          style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
        >
          <Ionicons name={item.icon} size={21} color={theme.colors.primary} />
        </Pressable>
      </Animated.View>
    )
  }

  const primaryActionButton = (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={menuOpen ? 'Cerrar acciones' : 'Acciones del reporte'}
      disabled={processingAction !== null}
      onPress={toggleMenu}
      style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}
    >
      {processingAction !== null ? (
        <ActivityIndicator color={theme.colors.white} />
      ) : (
        <Ionicons
          name={menuOpen ? 'close' : 'ellipsis-horizontal'}
          size={24}
          color={theme.colors.white}
        />
      )}
    </Pressable>
  )

  const secondaryActionButtons = menuMounted ? (
    <View style={[styles.secondaryActions, verticalMenu && styles.secondaryActionsVertical]}>
      {REPORT_ACTIONS.map(renderMenuAction)}
    </View>
  ) : null

  if (!html) {
    return (
      <View style={styles.loader}>
        <Image
          source={require('../assets/images/icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>CardioSync</Text>

        <Text style={styles.subtitle}>Generando informe clínico</Text>

        <Text style={styles.description}>
          Analizando mediciones e integrando datos de Health Connect...
        </Text>

        <ActivityIndicator size="large" />
      </View>
    )
  }

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
      {report ? (
        <View
          style={[
            styles.actionBar,
            verticalMenu && styles.actionBarVertical,
            { paddingTop: theme.spacing.sm, paddingBottom: theme.spacing.sm },
          ]}
        >
          <View style={[styles.actionControls, verticalMenu && styles.actionControlsVertical]}>
            {verticalMenu ? primaryActionButton : secondaryActionButtons}
            {verticalMenu ? secondaryActionButtons : primaryActionButton}
          </View>
          {processingAction !== null ? (
            <Text style={styles.processingLabel}>
              {processingAction === 'copy' ? 'Copiando...' : 'Generando...'}
            </Text>
          ) : null}
        </View>
      ) : null}
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
    backgroundColor: '#EDF4FF',
  },

  webview: {
    flex: 1,
    backgroundColor: '#EDF4FF',
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    backgroundColor: '#EDF4FF',
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
  actionBar: {
    alignItems: 'flex-end',
    paddingHorizontal: theme.spacing.md,
    backgroundColor: '#EDF4FF',
  },
  actionBarVertical: {
    alignItems: 'stretch',
  },
  actionControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  actionControlsVertical: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  secondaryActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  secondaryActionsVertical: {
    flexDirection: 'column',
  },
  menuAction: {
    borderRadius: theme.radius.round,
    ...theme.shadows.md,
  },
  primaryButton: {
    width: 52,
    height: 52,
    borderRadius: theme.radius.round,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.md,
  },
  secondaryButton: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.round,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  processingLabel: {
    alignSelf: 'flex-end',
    color: theme.colors.textSecondary,
    fontSize: theme.typography.small,
    fontFamily: theme.typography.semiBold,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
})
