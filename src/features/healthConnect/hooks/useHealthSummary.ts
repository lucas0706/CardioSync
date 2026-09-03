import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import { HealthSummary } from '@/domain/health/HealthSummary'

import {
  getHealthConnectSettings,
} from '../services/HealthConnectSettingsService'

import {
  healthConnectService,
} from '../services/HealthConnectService'

import {
  healthSummaryBuilder,
} from '../services/HealthSummaryBuilder'

export function useHealthSummary() {
  const [
    summary,
    setSummary,
  ] = useState<HealthSummary | null>(
    null,
  )

  const [
    loading,
    setLoading,
  ] = useState(false)

  const load =
    useCallback(async () => {
      try {
        const settings =
          getHealthConnectSettings()

        if (!settings.enabled) {
          setSummary(null)

          return
        }

        setLoading(true)

        const initialized =
          await healthConnectService.initialize()

        if (!initialized) {
          setSummary(null)

          return
        }

        const result =
          await healthSummaryBuilder.build()

        setSummary(result)
      } catch (error) {
        setSummary(null)

        console.error(
          '[HealthSummary] load failed',
          error,
        )
      } finally {
        setLoading(false)
      }
    }, [])

  useEffect(() => {
    void load()
  }, [load])

  return {
    summary,
    loading,
    reload: load,
  }
}
