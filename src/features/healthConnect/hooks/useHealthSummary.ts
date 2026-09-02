import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import { HealthSummary } from '@/domain/health/HealthSummary'

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
        setLoading(true)

        const result =
          await healthSummaryBuilder.build()

        setSummary(result)
      } catch (error) {
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
