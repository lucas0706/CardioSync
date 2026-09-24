import {
  useCallback,
  useEffect,
  useRef,
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
  const mountedRef =
    useRef(true)

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
          if (
            mountedRef.current
          ) {
            setSummary(null)
          }

          return
        }

        if (
          mountedRef.current
        ) {
          setLoading(true)
        }

        const initialized =
          await healthConnectService.initialize()

        if (!initialized) {
          if (
            mountedRef.current
          ) {
            setSummary(null)
          }

          return
        }

        const result =
          await healthSummaryBuilder.build()

        if (
          mountedRef.current
        ) {
          setSummary(result)
        }
      } catch (error) {
        if (
          mountedRef.current
        ) {
          setSummary(null)
        }

        console.error(
          '[HealthSummary] load failed',
          error,
        )
      } finally {
        if (
          mountedRef.current
        ) {
          setLoading(false)
        }
      }
    }, [])

  useEffect(() => {
    mountedRef.current =
      true

    void load()

    return () => {
      mountedRef.current =
        false
    }
  }, [load])

  return {
    summary,
    loading,
    reload: load,
  }
}
